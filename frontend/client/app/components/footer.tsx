import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 px-6 py-5 flex items-center justify-center gap-6 flex-wrap bg-white/80 backdrop-blur-sm relative z-20">
      <span className="text-xs text-gray-400">
        © {new Date().getFullYear()} PyxLab
      </span>
      <Link href="/" className="text-xs text-gray-400 hover:text-gray-700">
        Home
      </Link>
      <Link href="/about" className="text-xs text-gray-400 hover:text-gray-700">
        About
      </Link>
      <Link
        href="/privacy"
        className="text-xs text-gray-400 hover:text-gray-700"
      >
        Privacy
      </Link>
      <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-700">
        Terms
      </Link>
      <a
        href="https://www.gnu.org/licenses/gpl-3.0.html"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-400 hover:text-gray-700"
      >
        GPL-3.0
      </a>
    </footer>
  );
}
