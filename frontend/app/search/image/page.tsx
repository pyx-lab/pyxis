import type { Metadata } from "next";
import type { APIResponse } from "../../types";
import PageWrapper from "./pagewrapper";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const OG_IMAGE = { url: "/images/pyxis-og.jpg", width: 1200, height: 630, alt: "Pyxis Search Engine" };

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const query = (searchParams.q as string) || "";
  const title = query ? `${query} - Images` : "Image Search";
  return {
    title,
    openGraph: { title, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, images: [OG_IMAGE.url] },
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_URL_BACKEND_API || "http://localhost:5000";

export default async function ImageSearchPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = (searchParams.q as string) || "";
  const tagsParam = (searchParams.tags as string) || "";
  const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

  const combinedQuery = [query, ...tags].join(" ").trim();

  let data: APIResponse | null = null;
  let relatedKeywords: string[] = [];
  let errorMessage: string | null = null;

  if (combinedQuery) {
    const [searchRes, autoRes] = await Promise.allSettled([
      fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(combinedQuery)}&type=images&max_results=20&page=1`,
        { next: { revalidate: 600 } },
      ),
      fetch(
        `${API_BASE_URL}/autocomplete?q=${encodeURIComponent(combinedQuery)}&max_results=15`,
        { next: { revalidate: 600 } },
      ),
    ]);

    if (searchRes.status === "fulfilled" && searchRes.value.ok) {
      data = (await searchRes.value.json()) as APIResponse;
    } else {
      errorMessage = "Failed to load image results.";
    }

    if (autoRes.status === "fulfilled" && autoRes.value.ok) {
      const autoData = await autoRes.value.json();
      relatedKeywords = autoData.suggestions || [];
    }
  }

  return (
    <PageWrapper
      data={data}
      relatedKeywords={relatedKeywords}
      errorMessage={errorMessage}
      query={query}
      tags={tags}
    />
  );
}
