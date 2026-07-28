"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import type { ImageSearchResultItem } from "../../types";

const EAGER_LOAD_COUNT = 5;

interface ImageResultsListProps {
  results: ImageSearchResultItem[];
  isLoading?: boolean;
  selectedIndex: number | null;
  onSelect: (i: number | null) => void;
}

export default function ImageResultsList({
  results,
  isLoading = false,
  selectedIndex,
  onSelect,
}: ImageResultsListProps) {
  const [numCols, setNumCols] = useState(5);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const prevSelectedIndex = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setNumCols(
        w >= 1024 ? 5 : w >= 768 ? 4 : w >= 640 ? 3 : 2,
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const columns = useMemo(() => {
    const cols: { item: ImageSearchResultItem; index: number }[][] = Array.from(
      { length: numCols },
      () => [],
    );
    results.forEach((item, i) => {
      cols[i % numCols].push({ item, index: i });
    });
    return cols;
  }, [results, numCols]);

  const scrollToCard = (card: HTMLDivElement) => {
    const header = document.querySelector("header");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const rect = card.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const offsetPosition = absoluteTop - headerHeight - 16;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      const card = cardRefs.current.get(selectedIndex);
      if (card) {
        scrollToCard(card);
        prevSelectedIndex.current = selectedIndex;
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null && prevSelectedIndex.current !== null) {
      const lastIndex = prevSelectedIndex.current;
      setTimeout(() => {
        cardRefs.current.get(lastIndex)?.focus();
      }, 300);
      prevSelectedIndex.current = null;
    }
  }, [selectedIndex]);

  if (isLoading) return <ImageSkeletonGrid />;

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
        <svg
          className="w-10 h-10 opacity-30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm">No images found</p>
      </div>
    );
  }

  return (
    <div className="flex" style={{ gap: "0.625rem" }}>
      {columns.map((col, ci) => (
        <div
          key={ci}
          className="flex-1 min-w-0 flex flex-col"
          style={{ gap: "0.875rem" }}
        >
          {col.map(({ item, index }) => (
            <div
              key={`${item.image}-${index}`}
              id={`pyxis-img-${index}`}
              ref={(el) => {
                if (el) cardRefs.current.set(index, el);
                else cardRefs.current.delete(index);
              }}
              tabIndex={0}
              className="outline-none rounded-3xl"
            >
              <ImageCard
                item={item}
                index={index}
                isSelected={selectedIndex === index}
                onClick={() => onSelect(index === selectedIndex ? null : index)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

interface ImageCardProps {
  item: ImageSearchResultItem;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

function ImageCard({ item, index, isSelected, onClick }: ImageCardProps) {
  const thumb = item.thumbnail?.trim();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
  }, [item.thumbnail]);

  if (!thumb || hidden) return null;

  const hostname = (() => {
    try {
      return new URL(item.url).hostname;
    } catch {
      return "";
    }
  })();

  const ratio =
    item.width && item.height ? `${item.width}/${item.height}` : "4/3";

  return (
    <div
      className={`cursor-pointer flex flex-col bg-zinc-100 rounded-3xl overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-2 border-zinc-900 shadow-[0_0_25px_rgba(0,0,0,0.1)] scale-[1.01]"
          : "border border-zinc-100/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.05)] hover:border-zinc-200"
      }`}
      onClick={onClick}
    >
      <div
        className="relative w-full overflow-hidden bg-zinc-200"
        style={{ aspectRatio: ratio }}
      >
        <img
          src={thumb}
          alt={item.title}
          loading={index < EAGER_LOAD_COUNT ? "eager" : "lazy"}
          fetchPriority={index < EAGER_LOAD_COUNT ? "high" : "auto"}
          decoding="async"
          onError={() => setHidden(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center gap-1.5 px-2.5 pt-2">
        <img
          src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
          alt=""
          width={14}
          height={14}
          className="rounded-sm flex-shrink-0"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <p className="text-[11px] text-zinc-500 truncate">
          {item.source || hostname}
        </p>
      </div>
      <p className="text-[12px] font-medium text-zinc-700 line-clamp-2 leading-snug px-2.5 pt-1 pb-2.5">
        {item.title}
      </p>
    </div>
  );
}

interface SidePanelProps {
  results: ImageSearchResultItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function SidePanel({
  results,
  index,
  onClose,
  onPrev,
  onNext,
}: SidePanelProps) {
  const item = results[index];
  const thumb = item.thumbnail?.trim();
  const [fullReady, setFullReady] = useState(false);
  const [fullImageDimensions, setFullImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.left = "0";
      document.body.style.right = "0";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollYRef.current);
      };
    }
  }, [isMobile]);

  useEffect(() => {
    setFullReady(false);
    setFullImageDimensions(null);
    if (!item.image) return;
    const img = new window.Image();
    img.src = item.image;
    img.onload = () => {
      setFullReady(true);
      setFullImageDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      setFullReady(false);
      setFullImageDimensions(null);
    };
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [index, item.image]);

  const isPortrait = fullImageDimensions
    ? fullImageDimensions.height > fullImageDimensions.width
    : false;

  const [blurReady, setBlurReady] = useState(false);

  useEffect(() => {
    setBlurReady(false);
  }, [index]);

  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      const h =
        document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
      setHeaderH(h);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  const hostname = (() => {
    try {
      return new URL(item.url).hostname;
    } catch {
      return "";
    }
  })();

  const immediateImageUrl = thumb || item.image;

  if (isMobile) {
    return (
      <motion.div
        key={`mobile-${index}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        onAnimationComplete={() => setBlurReady(true)}
        className="fixed inset-0 z-[60] bg-white flex flex-col"
        style={{ touchAction: "none", willChange: "transform" }}
      >
        <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={onPrev}
              disabled={index === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="px-2 text-xs font-medium text-gray-500 tabular-nums">
              {index + 1} / {results.length}
            </div>
            <button
              onClick={onNext}
              disabled={index === results.length - 1}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-0 pb-4 flex flex-col min-h-0">
          <div className="bg-white rounded-t-[24px] shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden relative">
            <div className="relative bg-gray-50 flex-1 min-h-0 overflow-hidden z-0">
              <div className="relative w-full h-full flex items-center justify-center">
                {(() => {
                  if (!immediateImageUrl) return null;
                  if (!isPortrait) {
                    return (
                      <div className="relative w-full h-full overflow-hidden">
                        {blurReady && (
                          <div
                            className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover blur-2xl scale-125 opacity-80"
                            style={{ backgroundImage: `url(${immediateImageUrl})` }}
                          />
                        )}
                        <img
                          src={immediateImageUrl}
                          alt={item.title}
                          decoding="async"
                          className="relative w-auto h-full max-w-full object-contain z-10 mx-auto"
                        />
                        {fullReady && (
                          <motion.img
                            src={item.image}
                            alt={item.title}
                            decoding="async"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-0 left-0 w-auto h-full max-w-full object-contain z-20 mx-auto"
                            style={{ left: "50%", transform: "translateX(-50%)" }}
                          />
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex items-stretch justify-center w-full h-full">
                        {blurReady && (
                          <div
                            className="flex-1 bg-center bg-no-repeat bg-cover blur-2xl scale-125 opacity-80"
                            style={{ backgroundImage: `url(${immediateImageUrl})` }}
                          />
                        )}
                        <div className="flex items-center justify-center h-full relative">
                          <img
                            src={immediateImageUrl}
                            alt={item.title}
                            decoding="async"
                            className="h-full w-auto object-contain"
                          />
                          {fullReady && (
                            <motion.img
                              src={item.image}
                              alt={item.title}
                              decoding="async"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className="absolute top-0 left-0 h-full w-auto object-contain z-10"
                            />
                          )}
                        </div>
                        {blurReady && (
                          <div
                            className="flex-1 bg-center bg-no-repeat bg-cover blur-2xl scale-125 opacity-80"
                            style={{ backgroundImage: `url(${immediateImageUrl})` }}
                          />
                        )}
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            <div className="flex flex-col shrink-0 bg-white border-t border-gray-100 z-10">
              <div className="px-4 pt-4 pb-3 flex flex-col gap-2">
                <h2 className="text-base font-medium text-gray-900 leading-snug">
                  {item.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {item.width && item.height && (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-full">
                      <svg
                        className="w-3.5 h-3.5 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l-5-5m11 5v-4m0 4h-4m4 0l-5-5"
                        />
                      </svg>
                      {item.width} × {item.height}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-full max-w-full overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                      alt=""
                      width={14}
                      height={14}
                      className="rounded-sm flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="truncate">{item.source || hostname}</span>
                  </span>
                </div>
              </div>
              <div className="px-4 pb-4 pt-1 flex flex-col gap-2 shrink-0">
                <a
                  href={item.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-black text-white rounded-full text-[14px] font-medium text-center hover:bg-gray-800 active:bg-gray-900 transition-colors shadow-sm"
                >
                  View Full Image
                </a>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gray-100 text-gray-800 rounded-full text-[14px] font-medium text-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
                >
                  Visit Page
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`desktop-${index}`}
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      onAnimationComplete={() => setBlurReady(true)}
      className="fixed right-0 top-[var(--header-h)] bottom-0 w-[488px] bg-white shadow-2xl flex flex-col z-40 overflow-hidden border-l border-gray-200"
      style={{ "--header-h": `${headerH}px`, willChange: "transform, opacity" } as React.CSSProperties}
    >
      <div className="flex items-center justify-between px-4 py-4 shrink-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm border border-gray-200">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="px-2 text-xs font-medium text-gray-500 tabular-nums">
            {index + 1} / {results.length}
          </div>
          <button
            onClick={onNext}
            disabled={index === results.length - 1}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-50 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-11 h-11 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 px-0 pb-6 flex flex-col min-h-0">
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden relative">
          <div className="relative bg-gray-50 flex-1 min-h-0 overflow-hidden z-0">
            <div className="relative w-full h-full flex items-center justify-center">
              {(() => {
                if (!immediateImageUrl) return null;
                if (!isPortrait) {
                  return (
                    <div className="relative w-full h-full overflow-hidden">
                      {blurReady && (
                        <div
                          className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover blur-2xl scale-125 opacity-80"
                          style={{ backgroundImage: `url(${immediateImageUrl})` }}
                        />
                      )}
                      <img
                        src={immediateImageUrl}
                        alt={item.title}
                        decoding="async"
                        className="relative w-auto h-full max-w-full object-contain z-10 mx-auto"
                      />
                      {fullReady && (
                        <motion.img
                          src={item.image}
                          alt={item.title}
                          decoding="async"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="absolute top-0 left-0 w-auto h-full max-w-full object-contain z-20 mx-auto"
                          style={{ left: "50%", transform: "translateX(-50%)" }}
                        />
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-stretch justify-center w-full h-full">
                      {blurReady && (
                        <div
                          className="flex-1 bg-center bg-no-repeat bg-cover blur-2xl scale-125 opacity-80"
                          style={{ backgroundImage: `url(${immediateImageUrl})` }}
                        />
                      )}
                      <div className="flex items-center justify-center h-full relative">
                        <img
                          src={immediateImageUrl}
                          alt={item.title}
                          decoding="async"
                          className="h-full w-auto object-contain"
                        />
                        {fullReady && (
                          <motion.img
                            src={item.image}
                            alt={item.title}
                            decoding="async"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full w-auto object-contain z-10"
                          />
                        )}
                      </div>
                      {blurReady && (
                        <div
                          className="flex-1 bg-center bg-no-repeat bg-cover blur-2xl scale-125 opacity-80"
                          style={{ backgroundImage: `url(${immediateImageUrl})` }}
                        />
                      )}
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          <div className="flex flex-col shrink-0 bg-white border-t border-gray-100 z-10">
            <div className="px-4 pt-4 pb-3 flex flex-col gap-2">
              <h2 className="text-base font-medium text-gray-900 leading-snug">
                {item.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {item.width && item.height && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-full">
                    <svg
                      className="w-3.5 h-3.5 opacity-70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l-5-5m11 5v-4m0 4h-4m4 0l-5-5"
                      />
                    </svg>
                    {item.width} × {item.height}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-full max-w-full overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                    alt=""
                    width={14}
                    height={14}
                    className="rounded-sm flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="truncate">{item.source || hostname}</span>
                </span>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 flex flex-col gap-2 shrink-0">
              <a
                href={item.image}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-black text-white rounded-full text-[14px] font-medium text-center hover:bg-gray-800 active:bg-gray-900 transition-colors shadow-sm"
              >
                View Full Image
              </a>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-full text-[14px] font-medium text-center hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Visit Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ImageSkeletonGrid() {
  const heights = [
    "aspect-square",
    "aspect-video",
    "aspect-[4/3]",
    "aspect-[3/4]",
  ];

  return (
    <div className="flex" style={{ gap: "0.625rem" }}>
      {Array.from({ length: 5 }).map((_, ci) => (
        <div
          key={ci}
          className="flex-1 min-w-0 flex flex-col"
          style={{ gap: "0.875rem" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div
                className={`w-full bg-gray-200 rounded-xl animate-pulse ${heights[(ci + i) % 4]}`}
              />
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                <div className="w-16 h-2.5 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
