"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ImageCategoryBarProps {
  keywords: string[];
  currentQuery: string;
  activeTags: string[];
}

function stringToColor(str: string): string {
  const palette = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#EC4899",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function ImageCategoryBar({
  keywords,
  currentQuery,
  activeTags,
}: ImageCategoryBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getTagUrl = (tag: string, action: "add" | "remove"): string => {
    const params = new URLSearchParams(searchParams.toString());
    let next = [...activeTags];

    if (action === "remove") {
      next = next.filter((t) => t !== tag);
    } else if (!next.includes(tag)) {
      next.push(tag);
    }

    if (next.length > 0) {
      params.set("tags", next.join(","));
    } else {
      params.delete("tags");
    }

    if (currentQuery) params.set("q", currentQuery);
    return `/search/image?${params.toString()}`;
  };

  const suggestions = keywords
    .filter(
      (k) =>
        k.toLowerCase() !== currentQuery.toLowerCase() &&
        !activeTags.includes(k),
    )
    .slice(0, 12);

  const hasPills = currentQuery || activeTags.length > 0;

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {currentQuery && (
        <div className="flex-shrink-0 flex items-center gap-2 bg-black text-white pl-4 pr-3 py-1 rounded-lg h-[40px] shadow-sm">
          <span className="text-sm font-medium capitalize">{currentQuery}</span>
          <button
            onClick={() => router.push("/search/image")}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
            title="Clear search"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {activeTags.map((tag, i) => (
        <div
          key={`tag-${i}`}
          className="flex-shrink-0 flex items-center gap-2 bg-black text-white pl-4 pr-3 py-1 rounded-lg h-[40px] shadow-sm animate-in fade-in slide-in-from-left-2"
        >
          <span className="text-sm font-medium capitalize">{tag}</span>
          <Link
            href={getTagUrl(tag, "remove")}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
            scroll={false}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Link>
        </div>
      ))}

      {hasPills && suggestions.length > 0 && (
        <div className="h-6 w-[1px] bg-gray-200 mx-1 flex-shrink-0" />
      )}

      {suggestions.map((term, i) => (
        <Link
          key={i}
          href={getTagUrl(term, "add")}
          scroll={false}
          className="flex-shrink-0 flex items-center gap-3 pl-1 pr-4 py-1 bg-white border border-gray-200 rounded-lg h-[40px] hover:bg-gray-50 hover:border-gray-300 transition-all group"
        >
          <div
            className="w-8 h-8 rounded-md flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold uppercase"
            style={{ backgroundColor: stringToColor(term) }}
          >
            {term[0]}
          </div>
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap capitalize">
            {term}
          </span>
        </Link>
      ))}
    </div>
  );
}
