"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface InstantAnswerProps {
  answer: string;
  imageUrl: string | null;
  query: string;
}

export default function InstantAnswer({
  answer,
  imageUrl,
  query,
}: InstantAnswerProps) {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!answer) return null;

  const isLongText = answer.length > 200;

  return (
    <motion.div
      key={query}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 130, damping: 22, delay: 0.05 }}
      className="overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-100 hover:shadow-md hover:border-zinc-200 transition-all duration-300"
    >
      {imageUrl && (
      <motion.div
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full overflow-hidden bg-zinc-100/50"
      >
        {!imageError ? (
          <img
            src={imageUrl}
            alt={query}
            className="w-full h-auto object-contain"
            loading="lazy"
            fetchPriority="low"
            onError={() => setImageError(true)}
          />
        ) : null}

        <motion.a
          href={`https://wikipedia.org/wiki/${encodeURIComponent(query)}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-zinc-50 backdrop-blur-md border border-zinc-100/60 text-zinc-500 text-[10px] font-medium px-2.5 py-1 rounded-full hover:text-zinc-900 transition-colors shadow-sm"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
            <path d="M11 7h2v2h-2zm0 4h2v6h-2z" />
          </svg>
          Wikipedia
        </motion.a>
      </motion.div>
      )}

      <div className="px-5 pt-4 pb-5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-400 mb-2.5"
        >
          Quick Answer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.4, ease: "easeOut" }}
        >
          <p
            className={`text-sm text-zinc-700 leading-relaxed transition-all duration-300 ${
              !isExpanded ? "line-clamp-5" : ""
            }`}
          >
            {answer}
          </p>
          
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              {isExpanded ? "Show less" : "See more"}
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}