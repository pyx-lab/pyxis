"use client";

import { motion } from "framer-motion";
import type { VideoSearchResultItem } from "../../types";

interface VideoResultsListProps {
  results: VideoSearchResultItem[];
  isLoading?: boolean;
}

const getThumbnail = (item: VideoSearchResultItem) => {
  let url =
    typeof item.images === "string"
      ? item.images
      : item.images?.large ||
        item.images?.medium ||
        item.images?.small ||
        "/images/placeholder-video.svg";

  if (url.includes("ytimg.com/vi/")) {
    url = url.replace(
      /hqdefault\.jpg|default\.jpg|sddefault\.jpg|mqdefault\.jpg/g,
      "maxresdefault.jpg"
    );
  }
  return url;
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src.includes("maxresdefault.jpg")) {
    target.src = target.src.replace("maxresdefault.jpg", "mqdefault.jpg");
  } else {
    target.src = "https://picsum.photos/seed/fallback/640/360";
  }
};

const formatViews = (views?: number) => {
  if (!views) return null;
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString?.split("T")[0] || null;
  }
};

const PlayIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function VideoResultsList({
  results,
  isLoading = false,
}: VideoResultsListProps) {
  if (isLoading) return <VideoSkeletonGrid />;
  if (!results || results.length === 0)
    return (
      <div className="p-10 text-center text-zinc-500">No videos found.</div>
    );

  const canBuildBento = results.length >= 6;

  if (canBuildBento) {
    const heroVideo = results[0];
    const listVideos = results.slice(1, 4);
    const shortsVideos = results.slice(4, 6);
    const remainingVideos = results.slice(6);

    return (
      <div className="flex flex-col gap-8 pb-12 w-full max-w-[1600px] mx-auto">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "1.5rem",
            width: "100%",
          }}
        >
          <div className="flex flex-col">
            <HeroCard item={heroVideo} index={0} />
          </div>

          <div className="bg-zinc-100 border border-zinc-100/40 rounded-3xl p-5 flex flex-col">
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">
              Top Results
            </h3>
            <div className="flex flex-col gap-2 flex-grow">
              {listVideos.map((item, idx) => (
                <ListCard key={idx} item={item} index={idx + 1} />
              ))}
            </div>
          </div>

          <div className="bg-zinc-100 border border-zinc-100/40 rounded-3xl p-5 flex flex-col">
            <h3 className="text-xl font-semibold text-zinc-900 mb-4">Shorts</h3>
            <div className="grid grid-cols-2 gap-3 h-full">
              {shortsVideos.map((item, idx) => (
                <ShortCard key={idx} item={item} index={idx + 4} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          style={{
            gap: "1.5rem",
            width: "100%",
            marginTop: "0.5rem",
          }}
        >
          {remainingVideos.map((item, idx) => (
            <StandardCard key={idx} item={item} index={idx + 6} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      style={{
        gap: "1.5rem",
        width: "100%",
        paddingBottom: "2.5rem",
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {results.map((item, idx) => (
        <StandardCard key={idx} item={item} index={idx} />
      ))}
    </div>
  );
}

function HeroCard({
  item,
  index,
}: {
  item: VideoSearchResultItem;
  index: number;
}) {
  return (
    <a
      href={item.content}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-zinc-100 border border-zinc-100/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:border-zinc-200"
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
      >
        <img
          src={getThumbnail(item)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-125 saturate-150 opacity-70"
          aria-hidden="true"
        />

        <img
          src={getThumbnail(item)}
          alt={item.title}
          className="transition-transform duration-500 group-hover:scale-105"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 10,
          }}
          loading="eager"
          fetchPriority="high"
          onError={handleImageError}
        />

        <div className="absolute inset-0 z-20 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
            <PlayIcon className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
        {item.duration && (
          <div className="absolute bottom-3 right-3 z-20 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white">
            {item.duration}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h2 className="text-lg font-bold text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-600 transition-colors">
          {item.title}
        </h2>
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mt-auto pt-2">
          <img
            src={`https://www.google.com/s2/favicons?domain=${new URL(item.content || "https://youtube.com").hostname}&sz=32`}
            className="w-4 h-4 rounded-full"
            alt="icon"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {item.publisher || "YouTube"}
          <span>•</span>
          {formatViews(item.statistics?.viewCount)}
        </div>
      </div>
    </a>
  );
}

function ListCard({
  item,
  index,
}: {
  item: VideoSearchResultItem;
  index: number;
}) {
  return (
    <a
      href={item.content}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 items-start bg-zinc-100 border border-zinc-100/40 rounded-3xl p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:border-zinc-200"
    >
      <div className="relative w-[140px] shrink-0 aspect-video rounded-xl overflow-hidden bg-transparent">
        <img
          src={getThumbnail(item)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 saturate-150 opacity-70"
          aria-hidden="true"
        />

        <img
          src={getThumbnail(item)}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover z-10"
          loading="lazy"
          fetchPriority={index < 3 ? "high" : "auto"}
          onError={handleImageError}
        />
        <div className="absolute inset-0 z-20 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <PlayIcon className="w-5 h-5 text-white ml-0.5 opacity-90" />
        </div>
        {item.duration && (
          <div className="absolute bottom-1 right-1 z-20 bg-black/80 px-1 rounded text-[10px] font-bold text-white">
            {item.duration}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-grow min-w-0">
        <h4 className="text-[13px] font-semibold text-zinc-900 leading-snug line-clamp-3 group-hover:text-zinc-600 transition-colors">
          {item.title}
        </h4>
        <span className="text-[11px] text-zinc-500 truncate">
          {item.publisher || "Source"}{" "}
          {item.statistics?.viewCount
            ? `• ${formatViews(item.statistics.viewCount)}`
            : ""}
        </span>
      </div>
    </a>
  );
}

function ShortCard({
  item,
  index,
}: {
  item: VideoSearchResultItem;
  index: number;
}) {
  return (
    <a
      href={item.content}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative w-full bg-zinc-900 rounded-3xl overflow-hidden"
      style={{ paddingTop: "177.77%" }}
    >
      <img
        src={getThumbnail(item)}
        alt={item.title}
        className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        loading="lazy"
        fetchPriority={index < 6 ? "high" : "auto"}
      />
      <div
        className="bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <PlayIcon className="w-8 h-8 text-white/90 mb-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform shadow-lg" />
        <h4
          style={{
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: "1.3",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.title}
        </h4>
        <span
          style={{
            color: "#d4d4d8",
            fontSize: "10px",
            marginTop: "4px",
            fontWeight: 500,
          }}
        >
          {formatViews(item.statistics?.viewCount) || "Short"}
        </span>
      </div>
    </a>
  );
}

function StandardCard({
  item,
  index,
}: {
  item: VideoSearchResultItem;
  index: number;
}) {
  return (
    <a
      href={item.content}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-full flex flex-col bg-zinc-100 border border-zinc-100/40 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:border-zinc-200"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={getThumbnail(item)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 saturate-150 opacity-60"
          aria-hidden="true"
        />

        <img
          src={getThumbnail(item)}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          fetchPriority={index < 8 ? "high" : "auto"}
          onError={handleImageError}
        />
        <div className="absolute inset-0 z-20 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
            <PlayIcon className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
        {item.duration && (
          <div className="absolute bottom-1.5 right-1.5 z-20 bg-black/80 px-1.5 py-0.5 rounded text-[11px] font-bold text-white">
            {item.duration}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 px-3 py-3 min-w-0">
        <h3 className="text-sm font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover:text-zinc-600 transition-colors">
          {item.title}
        </h3>
        <div className="flex flex-wrap items-center gap-1 text-xs text-zinc-500 mt-0.5">
          {item.publisher && (
            <span className="font-medium text-zinc-600 max-w-[100px] truncate">
              {item.publisher}
            </span>
          )}
          {(item.statistics?.viewCount || item.published) && (
            <span className="flex items-center flex-wrap gap-1">
              {item.publisher && <span>•</span>}
              {formatViews(item.statistics?.viewCount)}
              {item.statistics?.viewCount && item.published && <span>•</span>}
              {formatDate(item.published)}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

function VideoSkeletonGrid() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        width: "100%",
        maxWidth: "1600px",
        margin: "0 auto",
        paddingBottom: "2.5rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "1.5rem",
          width: "100%",
        }}
      >
        <div
          className="bg-zinc-200 rounded-2xl animate-pulse"
          style={{ width: "100%", aspectRatio: "16 / 9" }}
        />
        <div
          className="bg-zinc-50 rounded-2xl p-4"
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-zinc-200 rounded-xl animate-pulse"
              style={{ height: "80px" }}
            />
          ))}
        </div>
        <div
          className="bg-zinc-50 rounded-2xl p-4"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div
            className="bg-zinc-200 rounded-xl animate-pulse"
            style={{ width: "100%", aspectRatio: "9 / 16" }}
          />
          <div
            className="bg-zinc-200 rounded-xl animate-pulse"
            style={{ width: "100%", aspectRatio: "9 / 16" }}
          />
        </div>
      </div>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        style={{
          gap: "1.5rem",
          width: "100%",
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div
              className="bg-zinc-200 rounded-xl animate-pulse"
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            />
            <div
              className="bg-zinc-200 rounded animate-pulse"
              style={{ width: "75%", height: "1rem" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}