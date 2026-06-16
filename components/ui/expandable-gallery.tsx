"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import React, { useState, useId, useRef } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

const PHOTOS = [
  { id: "photo-01", src: "/photos/photo-01.jpeg", alt: "Продукт — кришка", rotation: -15, x: -90, y: 10, zIndex: 10 },
  { id: "photo-02", src: "/photos/photo-02.jpeg", alt: "Продукт — етикетка", rotation: -3, x: -10, y: -15, zIndex: 20 },
  { id: "photo-03", src: "/photos/photo-03.jpeg", alt: "Продукт — крупний", rotation: 12, x: 75, y: 5, zIndex: 30 },
  { id: "photo-04", src: "/photos/photo-04.jpeg", alt: "Продукт — макро низ" },
  { id: "photo-05", src: "/photos/photo-05.jpeg", alt: "Продукт — багато" },
  { id: "photo-06", src: "/photos/photo-06.jpeg", alt: "Продукт — 5 штук" },
  { id: "photo-07", src: "/photos/photo-07.jpeg", alt: "Продукт — дно" },
  { id: "photo-08", src: "/photos/photo-08.jpeg", alt: "Продукти — коса етикетка" },
  { id: "photo-09", src: "/photos/photo-09.jpeg", alt: "Продукт — повний" },
  { id: "photo-10", src: "/photos/photo-10.jpeg", alt: "Басейн 1" },
  { id: "photo-11", src: "/photos/photo-11.jpeg", alt: "Басейн 2" },
  { id: "photo-12", src: "/photos/photo-12.jpeg", alt: "Візуал" },
  { id: "photo-13", src: "/photos/photo-13.jpeg", alt: "Кейс 3" },
  { id: "photo-14", src: "/photos/photo-14.jpeg", alt: "Кейс літає" },
  { id: "photo-15", src: "/photos/photo-15.jpeg", alt: "Кейси" },
  { id: "photo-16", src: "/photos/photo-16.jpeg", alt: "Коробка 1" },
  { id: "photo-17", src: "/photos/photo-17.jpeg", alt: "Коробка макро" },
  { id: "photo-18", src: "/photos/photo-18.jpeg", alt: "Небо 1" },
  { id: "photo-19", src: "/photos/photo-19.jpeg", alt: "Небо 2" },
  { id: "photo-20", src: "/photos/photo-20.jpeg", alt: "Небо і фрукти" },
  { id: "photo-21", src: "/photos/photo-21.jpeg", alt: "Супермаркет 1" },
  { id: "photo-22", src: "/photos/photo-22.jpeg", alt: "Супермаркет 2" },
  { id: "photo-23", src: "/photos/photo-23.jpeg", alt: "Супермаркет 3" },
  { id: "photo-24", src: "/photos/photo-24.jpeg", alt: "Фрукти 1" },
  { id: "photo-25", src: "/photos/photo-25.jpeg", alt: "Фрукти 2" },
  { id: "photo-26", src: "/photos/photo-26.jpeg", alt: "Фрукти 3" },
];

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
} as const;

export function ExpandableGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const layoutGroupId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    if (isExpanded) setIsExpanded(false);
  });

  return (
    <section className="relative w-full px-4 md:px-8 bg-background flex flex-col items-center justify-start min-h-[850px] overflow-hidden">
      <LayoutGroup id={layoutGroupId}>
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="w-full h-12 flex items-center justify-between px-4 mb-2">
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
            className={cn(
              "relative w-full",
              isExpanded
                ? "grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4"
                : "flex flex-col items-center justify-start pt-4"
            )}
            transition={transition}
          >
            <div
              className={cn(
                "relative",
                isExpanded
                  ? "contents"
                  : "h-[450px] w-full flex items-center justify-center mb-8"
              )}
            >
              {PHOTOS.map((photo, index) => {
                const isPrimary = index < 3;
                if (!isPrimary && !isExpanded) return null;

                return (
                  <motion.div
                    key={`card-${photo.id}`}
                    layoutId={`card-container-${photo.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? photo.rotation || 0 : 0,
                      x: !isExpanded ? photo.x || 0 : 0,
                      y: !isExpanded ? photo.y || 0 : 0,
                      zIndex: !isExpanded ? photo.zIndex || index : 10,
                    }}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: (photo.y || 0) - 15,
                            rotate: (photo.rotation || 0) * 0.8,
                            zIndex: 50,
                            transition: { type: "spring", stiffness: 400, damping: 25 },
                          }
                        : { scale: 1.02 }
                    }
                    className={cn(
                      "cursor-pointer overflow-hidden bg-muted",
                      isExpanded
                        ? "relative aspect-square rounded-[2rem] md:rounded-[3rem] border-4 md:border-[6px] border-background shadow-lg"
                        : "absolute w-44 h-44 md:w-60 md:h-60 rounded-[2.5rem] md:rounded-[3rem] border-[6px] border-background shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                    )}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                  >
                    <motion.div
                      layoutId={`image-inner-${photo.id}`}
                      layout="position"
                      className="w-full h-full relative"
                      transition={transition}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover select-none pointer-events-none"
                        sizes={isExpanded ? "(max-width: 1024px) 50vw, 33vw" : "240px"}
                        priority={isPrimary}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  key="stack-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-2xl space-y-8"
                >
                  <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-foreground/90 leading-tight">
                    Boostiva Detox —<br className="hidden md:block" />
                    фотографії продукту
                  </h2>

                  <div className="flex justify-center">
                    <Button
                      variant="default"
                      onClick={() => setIsExpanded(true)}
                      className="rounded-full cursor-pointer py-6 px-8 border-border/40 font-normal group"
                    >
                      Переглянути всі фото
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="transition-transform group-hover:translate-x-1"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </section>
  );
}

export default ExpandableGallery;
