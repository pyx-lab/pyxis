"""
Instant answer retrieval using the DuckDuckGo Instant Answer API with image fallback
from Wikipedia and Wikimedia Commons.
"""

import csv
import os
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed, TimeoutError
from typing import Optional, Tuple

import requests

_FILTER_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "filters")
_EXTENSIONS_CSV = os.path.join(_FILTER_DIR, "safe_image_extensions.csv")
_KEYWORDS_CSV = os.path.join(_FILTER_DIR, "blocked_keywords.csv")


def _load_csv_column(path: str) -> frozenset:
    result: set = set()
    try:
        with open(path, newline="", encoding="utf-8") as fh:
            reader = csv.reader(fh)
            next(reader, None)
            for row in reader:
                if row:
                    value = row[0].strip().lower()
                    if value:
                        result.add(value)
    except FileNotFoundError:
        print(f"[FILTER] CSV not found: {path}")
    except Exception as e:
        print(f"[FILTER] Failed to load {path}: {e}")
    return frozenset(result)


SAFE_IMAGE_EXTENSIONS: frozenset = _load_csv_column(_EXTENSIONS_CSV)
BLOCKED_KEYWORDS: frozenset = _load_csv_column(_KEYWORDS_CSV)


def is_safe_image_url(url: str) -> bool:
    lower = url.lower()
    if not any(lower.endswith(ext) for ext in SAFE_IMAGE_EXTENSIONS):
        return False
    if any(kw in lower for kw in BLOCKED_KEYWORDS):
        return False
    return True


class MultiSourceImageFetcher:
    """Fetches an image URL from Wikipedia and Wikimedia Commons concurrently."""

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update(
            {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"}
        )

    def get_image(self, query: str) -> Optional[str]:
        sources = [self._get_wikipedia_image, self._get_wikimedia_commons_image]
        with ThreadPoolExecutor(max_workers=2) as ex:
            futures = {ex.submit(src, query): src for src in sources}
            try:
                for future in as_completed(futures, timeout=4):
                    try:
                        result = future.result()
                        if result and is_safe_image_url(result):
                            return result
                    except Exception:
                        continue
            except TimeoutError:
                pass
        return None

    def _get_wikipedia_image(self, query: str) -> Optional[str]:
        try:
            params = {
                "action": "query",
                "format": "json",
                "titles": query,
                "prop": "pageimages",
                "pithumbsize": 800,
            }
            r = self.session.get(
                "https://en.wikipedia.org/w/api.php", params=params, timeout=4
            )
            pages = r.json().get("query", {}).get("pages", {})
            for page in pages.values():
                if "thumbnail" in page:
                    return page["thumbnail"]["source"]
            return None
        except Exception:
            return None

    def _get_wikimedia_commons_image(self, query: str) -> Optional[str]:
        try:
            params = {
                "action": "query",
                "format": "json",
                "generator": "search",
                "gsrnamespace": "6",
                "gsrsearch": query,
                "gsrlimit": "1",
                "prop": "imageinfo",
                "iiprop": "url",
                "iiurlwidth": "800",
            }
            r = self.session.get(
                "https://commons.wikimedia.org/w/api.php", params=params, timeout=4
            )
            pages = r.json().get("query", {}).get("pages", {})
            for page in pages.values():
                imageinfo = page.get("imageinfo", [])
                if imageinfo and "thumburl" in imageinfo[0]:
                    return imageinfo[0]["thumburl"]
            return None
        except Exception:
            return None


class InstantAnswerClient:
    """Client for the DuckDuckGo Instant Answer API."""

    def __init__(self):
        self.base_url = "https://api.duckduckgo.com"
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": "InstantAnswerCLI/1.0"})
        self.image_fetcher = MultiSourceImageFetcher()

    def fetch_answer_and_image(self, query: str) -> Tuple[Optional[str], Optional[str]]:
        with ThreadPoolExecutor(max_workers=2) as ex:
            answer_future = ex.submit(self._fetch_answer, query)
            image_future = ex.submit(self.image_fetcher.get_image, query)
            try:
                answer = answer_future.result(timeout=7)
            except Exception:
                answer = None
            try:
                image_url = image_future.result(timeout=5)
            except Exception:
                image_url = None

        return answer, image_url

    def _fetch_answer(self, query: str) -> Optional[str]:
        try:
            params = {
                "q": query,
                "format": "json",
                "no_html": 1,
                "skip_disambig": 1,
                "kp": 1,
            }
            r = self.session.get(self.base_url, params=params, timeout=6)
            r.raise_for_status()
            return self._extract_answer(r.json())
        except requests.RequestException:
            return None

    def _extract_answer(self, data: dict) -> Optional[str]:
        for field in ["Abstract", "Answer", "Definition", "AbstractText"]:
            val = data.get(field, "").strip()
            if val:
                return val
        return None


def main() -> None:
    client = InstantAnswerClient()

    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        answer, image_url = client.fetch_answer_and_image(query)
        print(f"Query: {query}\nAnswer: {answer or 'None'}\nImage: {image_url or 'None'}")
        sys.exit(0)

    print("Instant Answer Tool (Ctrl+C to exit)")
    try:
        while True:
            try:
                query = input("> ").strip()
            except EOFError:
                break
            if not query or query.lower() in ("quit", "exit"):
                continue
            answer, image_url = client.fetch_answer_and_image(query)
            print(f"\nAnswer: {answer or 'None'}")
            if image_url:
                print(f"Image:  {image_url}")
            print()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
