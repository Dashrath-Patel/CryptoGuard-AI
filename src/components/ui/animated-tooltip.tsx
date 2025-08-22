"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
    color?: string;
    icon?: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: any) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = event.target.offsetWidth / 2;
      x.set(event.nativeEvent.offsetX - halfWidth);
    });
  };

  return (
    <div className="flex items-center">
      {items.map((item, idx) => (
        <div
          className="group relative -mr-4 z-10"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-20 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-xl bg-black/90 backdrop-blur-sm px-4 py-3 text-xs shadow-xl border border-neutral-700"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white mb-1">
                  {item.name}
                </div>
                <div className="text-xs text-neutral-300">{item.designation}</div>
                {item.icon && (
                  <div className="text-lg mt-1">{item.icon}</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced Avatar */}
          <div
            onMouseMove={handleMouseMove}
            className={`relative h-14 w-14 rounded-full border-2 border-white transition-all duration-300 group-hover:z-30 group-hover:scale-110 group-hover:border-4 cursor-pointer flex items-center justify-center text-2xl ${
              item.color || 'bg-gradient-to-br from-neutral-700 to-neutral-800'
            } group-hover:shadow-lg group-hover:shadow-white/20`}
          >
            {item.image}
          </div>
        </div>
      ))}
    </div>
  );
};
