"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import React, { useState, useId, useRef, useEffect, useCallback } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type Photo = {
  id: string;
  src: string;
  thumbSrc: string;
  alt: string;
  width: number;
  height: number;
  wide?: boolean; // spans 2 columns (landscape only)
  rotation?: number;
  x?: number;
  y?: number;
  zIndex?: number;
};

// Order: Продукт → Небо → Басейн → Фрукти → Коробка → Супермаркет → Кейси
// 3 landscape photos marked wide:true to span 2 columns (spread across gallery)
const PHOTOS: Photo[] = [
  // Кейси
  { id: "photo-14", src: "/photos/photo-14.jpeg", thumbSrc: "/photos/photo-14-thumb.jpeg", alt: "Кейс літає",          width: 2400, height: 1792, wide: true },
  { id: "photo-13", src: "/photos/photo-13.jpeg", thumbSrc: "/photos/photo-13-thumb.jpeg", alt: "Кейс 3",              width: 1792, height: 2400 },
  // Фрукти
  { id: "photo-26", src: "/photos/photo-26.jpeg", thumbSrc: "/photos/photo-26-thumb.jpeg", alt: "Фрукти 3",            width: 1792, height: 2400 },
  { id: "photo-25", src: "/photos/photo-25.jpeg", thumbSrc: "/photos/photo-25-thumb.jpeg", alt: "Фрукти 2",            width: 1792, height: 2400 },
  { id: "photo-24", src: "/photos/photo-24.jpeg", thumbSrc: "/photos/photo-24-thumb.jpeg", alt: "Фрукти 1",            width: 2400, height: 1792, wide: true },
  // Небо + Басейн
  { id: "photo-11", src: "/photos/photo-11.jpeg", thumbSrc: "/photos/photo-11-thumb.jpeg", alt: "Басейн 2",            width: 1792, height: 2400 },
  { id: "photo-19", src: "/photos/photo-19.jpeg", thumbSrc: "/photos/photo-19-thumb.jpeg", alt: "Небо 2",              width: 1792, height: 2400 },
  { id: "photo-20", src: "/photos/photo-20.jpeg", thumbSrc: "/photos/photo-20-thumb.jpeg", alt: "Небо і фрукти",       width: 1792, height: 2400, wide: true },
  { id: "photo-10", src: "/photos/photo-10.jpeg", thumbSrc: "/photos/photo-10-thumb.jpeg", alt: "Басейн 1",            width: 2400, height: 1792, wide: true },
  { id: "photo-18", src: "/photos/photo-18.jpeg", thumbSrc: "/photos/photo-18-thumb.jpeg", alt: "Небо 1",              width: 1792, height: 2400 },
  // Супермаркет
  { id: "photo-23", src: "/photos/photo-23.jpeg", thumbSrc: "/photos/photo-23-thumb.jpeg", alt: "Супермаркет 3",       width: 2400, height: 1792 },
  { id: "photo-15", src: "/photos/photo-15.jpeg", thumbSrc: "/photos/photo-15-thumb.jpeg", alt: "Кейси",               width: 2400, height: 1792 },
  { id: "photo-22", src: "/photos/photo-22.jpeg", thumbSrc: "/photos/photo-22-thumb.jpeg", alt: "Супермаркет 2",       width: 2400, height: 1792 },
  { id: "photo-21", src: "/photos/photo-21.jpeg", thumbSrc: "/photos/photo-21-thumb.jpeg", alt: "Супермаркет 1",       width: 2400, height: 1792 },
  // Коробка
  { id: "photo-17", src: "/photos/photo-17.jpeg", thumbSrc: "/photos/photo-17-thumb.jpeg", alt: "Коробка макро",       width: 2400, height: 1792 },
  { id: "photo-16", src: "/photos/photo-16.jpeg", thumbSrc: "/photos/photo-16-thumb.jpeg", alt: "Коробка 1",           width: 2400, height: 1792 },
  // Продукт
  { id: "photo-08", src: "/photos/photo-08.jpeg", thumbSrc: "/photos/photo-08-thumb.jpeg", alt: "Продукти — коса",     width: 2752, height: 1536 },
  { id: "photo-09", src: "/photos/photo-09.jpeg", thumbSrc: "/photos/photo-09-thumb.jpeg", alt: "Продукт — повний",    width: 1536, height: 2752 },
  { id: "photo-07", src: "/photos/photo-07.jpg",  thumbSrc: "/photos/photo-07-thumb.jpg",  alt: "Продукт — 5 пляшок", width: 2400, height: 1600 },
  { id: "photo-05", src: "/photos/photo-05.jpeg", thumbSrc: "/photos/photo-05-thumb.jpeg", alt: "Продукт — багато",    width: 2400, height: 1792, wide: true },
  { id: "photo-04", src: "/photos/photo-04.jpeg", thumbSrc: "/photos/photo-04-thumb.jpeg", alt: "Продукт — макро низ", width: 2400, height: 1792 },
  { id: "photo-03", src: "/photos/photo-03.jpeg", thumbSrc: "/photos/photo-03-thumb.jpeg", alt: "Продукт — крупний",   width: 2400, height: 1792 },
  { id: "photo-02", src: "/photos/photo-02.jpeg", thumbSrc: "/photos/photo-02-thumb.jpeg", alt: "Продукт — етикетка",  width: 2400, height: 1792 },
  { id: "photo-01", src: "/photos/photo-01.jpeg", thumbSrc: "/photos/photo-01-thumb.jpeg", alt: "Продукт — кришка",    width: 1792, height: 2400 },
];

// The 3 photos shown in the stacked preview
const STACK_PHOTOS = [
  { id: "photo-10", src: "/photos/photo-10.jpeg", alt: "Басейн 1",  width: 2400, height: 1792, rotation: -15, x: -90, y: 10,  xSm: -55, ySm: 8,   zIndex: 10 },
  { id: "photo-13", src: "/photos/photo-13.jpeg", alt: "Кейс 3",    width: 1792, height: 2400, rotation: -3,  x: -10, y: -15, xSm: -6,  ySm: -10, zIndex: 20 },
  { id: "photo-26", src: "/photos/photo-26.jpeg", alt: "Фрукти 3",  width: 1792, height: 2400, rotation: 12,  x: 75,  y: 5,   xSm: 48,  ySm: 4,   zIndex: 30 },
];

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
} as const;

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];
  const isPortrait = photo.height > photo.width;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >
        <HugeiconsIcon icon={Cancel01Icon} width={24} height={24} />
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} width={24} height={24} />
      </button>

      {/* Image */}
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="relative flex items-center justify-center"
        style={{
          maxWidth: isPortrait ? "min(90vw, 55vh)" : "min(90vw, 130vh)",
          maxHeight: "90vh",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="w-full h-auto max-h-[90vh] object-contain select-none pointer-events-none rounded-lg"
          sizes="90vw"
          priority
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </motion.div>

      {/* Next */}
      <button
        className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} width={24} height={24} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums">
        {index + 1} / {photos.length}
      </div>
    </motion.div>
  );
}

function MasonryGrid({
  photos,
  gap,
  onPhotoClick,
}: {
  photos: Photo[];
  gap: number;
  onPhotoClick: (i: number) => void;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(2);

  const doLayout = useCallback((grid: HTMLDivElement, colWidth: number) => {
    const cols = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 3 : 2;
    setCols(cols);
    const colHeights = new Array(cols).fill(0);

    Array.from(grid.children).forEach((child, i) => {
      const photo = photos[i];
      if (!photo) return;
      const el = child as HTMLElement;
      const span = photo.wide ? 2 : 1;
      const itemWidth = span === 2 ? colWidth * 2 + gap : colWidth;
      const itemHeight = itemWidth * (photo.height / photo.width);

      let startCol = 0;
      if (span === 1) {
        let minH = Infinity;
        for (let c = 0; c < cols; c++) {
          if (colHeights[c] < minH) { minH = colHeights[c]; startCol = c; }
        }
      } else {
        let minH = Infinity;
        for (let c = 0; c <= cols - 2; c++) {
          const h = Math.max(colHeights[c], colHeights[c + 1]);
          if (h < minH) { minH = h; startCol = c; }
        }
      }

      const startPx = Math.max(...colHeights.slice(startCol, startCol + span));
      el.style.gridColumnStart = String(startCol + 1);
      el.style.gridColumnEnd = String(startCol + 1 + span);
      el.style.gridRowStart = String(Math.round(startPx) + 1);
      el.style.gridRowEnd = String(Math.round(startPx) + 1 + Math.round(itemHeight));

      for (let c = startCol; c < startCol + span; c++) {
        colHeights[c] = startPx + itemHeight + gap;
      }
    });
  }, [photos, gap]);

  const recalc = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cs = getComputedStyle(grid);
    const containerWidth = grid.getBoundingClientRect().width
      - parseFloat(cs.paddingLeft || "0")
      - parseFloat(cs.paddingRight || "0");
    const cols = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 3 : 2;
    setCols(cols);
    const estimatedColWidth = (containerWidth - (cols - 1) * gap) / cols;

    // First pass with estimated width
    doLayout(grid, estimatedColWidth);

    // Second pass: read actual rendered column width for pixel-perfect height
    requestAnimationFrame(() => {
      const firstNonWide = Array.from(grid.children).find((_, i) => !photos[i]?.wide) as HTMLElement | undefined;
      if (!firstNonWide) return;
      const actualColWidth = firstNonWide.getBoundingClientRect().width;
      if (Math.abs(actualColWidth - estimatedColWidth) > 0.5) {
        doLayout(grid, actualColWidth);
      }
    });
  }, [photos, gap, doLayout]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      ref={gridRef}
      className="grid px-1 pb-12"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: "1px",
        columnGap: `${gap}px`,
        rowGap: 0,
      }}
    >
      {photos.map((photo, index) => (
        <div
          key={`grid-${photo.id}`}
          className="overflow-hidden rounded-xl md:rounded-2xl cursor-pointer group"
          onClick={() => onPhotoClick(index)}
        >
          <Image
            src={photo.thumbSrc}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="w-full h-auto block select-none pointer-events-none scale-[1.05] group-hover:scale-[1.08] transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      ))}
    </motion.div>
  );
}

export function ExpandableGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const layoutGroupId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close gallery only when lightbox is NOT open
  useOutsideClick(containerRef, () => {
    if (isExpanded && lightboxIndex === null) setIsExpanded(false);
  });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length));
  const nextPhoto = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % PHOTOS.length));

  return (
    <>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={PHOTOS}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>

      <section className="relative w-full bg-background flex flex-col items-center justify-start min-h-[850px]">
        <LayoutGroup id={layoutGroupId}>
          <div className={`w-full flex flex-col items-center ${isExpanded ? "" : "max-w-6xl mx-auto px-4 md:px-8"}`}>
            {/* Back button row */}
            <div className="w-full h-12 flex items-center px-4 mb-2">
              <AnimatePresence>
                {isExpanded && (
                  <motion.button
                    key="back-button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => setIsExpanded(false)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all group z-50"
                  >
                    <div className="p-2 rounded-full bg-muted group-hover:bg-accent transition-colors text-foreground">
                      <HugeiconsIcon icon={ArrowLeft01Icon} width={20} height={20} />
                    </div>
                    <span className="font-medium">Назад</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              ref={containerRef}
              layout
              className="relative w-full"
              transition={transition}
            >
              {/* Collapsed: stacked preview */}
              {!isExpanded && (
                <div className="flex flex-col items-center pt-4">
                  <div className="h-[200px] sm:h-[260px] md:h-[320px] w-full flex items-center justify-center mb-6 md:mb-12">
                    {STACK_PHOTOS.map((photo, index) => (
                      <motion.div
                        key={`stack-${photo.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: photo.rotation || 0,
                          x: isMobile ? (photo.xSm ?? photo.x ?? 0) : (photo.x || 0),
                          y: isMobile ? (photo.ySm ?? photo.y ?? 0) : (photo.y || 0),
                          zIndex: photo.zIndex || index,
                        }}
                        transition={transition}
                        whileHover={{
                          scale: 1.05,
                          y: (isMobile ? (photo.ySm ?? photo.y ?? 0) : (photo.y || 0)) - 15,
                          rotate: (photo.rotation || 0) * 0.8,
                          zIndex: 50,
                          transition: { type: "spring", stiffness: 400, damping: 25 },
                        }}
                        className="absolute w-32 h-32 sm:w-44 sm:h-44 md:w-60 md:h-60 rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3rem] border-[6px] border-background shadow-[0_20px_50px_rgba(0,0,0,0.15)] cursor-pointer overflow-hidden bg-muted"
                        onClick={() => setIsExpanded(true)}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover select-none pointer-events-none"
                          sizes="240px"
                          priority
                          draggable={false}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    key="stack-content"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center max-w-2xl w-full space-y-8"
                  >
                    <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-foreground/90 leading-tight">
                      Cześć Boostiva!
                    </h2>
                    <div className="flex justify-center">
                      <Button
                        variant="default"
                        onClick={() => setIsExpanded(true)}
                        className="rounded-full cursor-pointer py-6 px-8 font-normal group"
                      >
                        Zobacz wizualizacje
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="transition-transform group-hover:translate-x-1"
                          width={20}
                          height={20}
                        />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Expanded: JS masonry grid — 1px rows, spans calculated from real column width */}
              {isExpanded && <MasonryGrid photos={PHOTOS} gap={12} onPhotoClick={openLightbox} />}
            </motion.div>
          </div>
        </LayoutGroup>
      </section>
    </>
  );
}

export default ExpandableGallery;
