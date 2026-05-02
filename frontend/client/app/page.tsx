"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HomeSearchBar from "./components/homesearchbar";
import Footer from "./components/footer";

const SEARCH_TABS = [
  { label: "Web", value: "text" },
  { label: "Images", value: "image" },
  { label: "Videos", value: "video" },
  { label: "News", value: "news" },
  { label: "Books", value: "book" },
];

export default function Home() {
  const [searchMode, setSearchMode] = useState("text");

  return (
    <div className="flex min-h-dvh flex-col bg-waves relative z-0 w-full">
      <main className="flex flex-1 flex-col items-center justify-center px-6 sm:px-8 pb-16 sm:pb-0 relative z-30 [overflow-x:clip]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-[500px] bg-white blur-[80px] rounded-full pointer-events-none -z-10"></div>

        <div className="w-full sm:max-w-4xl flex flex-col items-center gap-8 sm:gap-10">
          <Image
            src="/images/pyxis.svg"
            alt="Pyxis"
            width={260}
            height={88}
            priority
            className="w-[180px] sm:w-[260px] h-auto select-none"
            draggable={false}
          />

          <HomeSearchBar searchMode={searchMode} />

          <div className="w-full flex items-center justify-between sm:justify-center sm:gap-3">
            {SEARCH_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSearchMode(tab.value)}
                className={`px-2 sm:px-4 py-1.5 rounded-full text-[13px] sm:text-sm whitespace-nowrap transition-colors ${
                  searchMode === tab.value
                    ? "bg-black text-white"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
