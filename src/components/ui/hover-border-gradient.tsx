"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  onMouseEnter: propOnMouseEnter,
  onMouseLeave: propOnMouseLeave,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    clockwise?: boolean;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  } & Omit<React.HTMLAttributes<HTMLElement>, 'onMouseEnter' | 'onMouseLeave'>
>) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setHovered(true);
    propOnMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setHovered(false);
    propOnMouseLeave?.(e);
  };

  const rotateDirection = (currentDirection: Direction): Direction => {
    const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM:
      "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT:
      "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };

  const highlight =
    "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(50, 117, 248, 0.4) 50%, rgba(255, 255, 255, 0) 100%)";

  const glowHighlight = 
    "radial-gradient(90% 200% at 50% 50%, rgba(50, 117, 248, 0.8) 0%, rgba(147, 51, 234, 0.6) 30%, rgba(59, 130, 246, 0.4) 60%, rgba(255, 255, 255, 0) 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  // Cast Tag to any to avoid TypeScript errors with dynamic components
  const Component = Tag as any;

  return (
    <Component 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition-all duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit hover:shadow-2xl hover:shadow-blue-500/30 cursor-pointer",
        containerClassName
      )}
      {...props}
    >
      {/* Enhanced glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
        animate={{
          opacity: hovered ? 0.6 : 0,
          scale: hovered ? 1.1 : 1,
        }}
        style={{
          background: glowHighlight,
          filter: "blur(20px)",
          zIndex: -1,
        }}
      />
      
      <div
        className={cn(
          "w-auto text-white z-20 bg-black px-4 py-2 rounded-[inherit] relative overflow-hidden",
          className
        )}
      >
        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 -skew-x-12"
          animate={{
            x: hovered ? ["100%", "-100%"] : "100%",
            opacity: hovered ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
        {children}
      </div>
      <motion.div
        className={cn(
          "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        )}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight, glowHighlight]
            : movingMap[direction],
        }}
        transition={{ 
          ease: "linear", 
          duration: duration, 
          repeat: hovered ? Infinity : 0 
        }}
      />
      {/* Background layer - lower z-index than text */}
      <div className="bg-black absolute z-10 flex-none inset-[2px] rounded-[100px]" />
    </Component>
  );
}