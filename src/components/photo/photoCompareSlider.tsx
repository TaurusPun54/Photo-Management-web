"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ImageCompareSliderProps {
  originalImageURL: string;
  restoredImageURL: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio?: string;
}

export function ImageCompareSlider({
  originalImageURL,
  restoredImageURL,
  alt,
  width,
  height,
  aspectRatio = "16/9",
}: ImageCompareSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 除錯：檢查傳入的 props 和滑塊位置
  useEffect(() => {
    console.log("ImageCompareSlider props:", {
      originalImageURL,
      restoredImageURL,
      width,
      height,
      aspectRatio,
      sliderPosition,
    });
  }, [
    originalImageURL,
    restoredImageURL,
    width,
    height,
    aspectRatio,
    sliderPosition,
  ]);

//   useEffect(() => {
//     const updateDimensions = () => {
//       if (containerRef.current) {
//         const { width, height } = containerRef.current.getBoundingClientRect();
//         setDimensions({ width, height });
//       }
//     };

//     updateDimensions();
//     window.addEventListener("resize", updateDimensions);
//     return () => window.removeEventListener("resize", updateDimensions);
//   }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const calculateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return 0;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;

    // Clamp the position between 0 and 100
    return Math.min(Math.max(position, 0), 100);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const position = calculateSliderPosition(e.clientX);
    if (position !== undefined) setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    const position = calculateSliderPosition(e.touches[0].clientX);
    if (position !== undefined) setSliderPosition(position);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative max-h-[85vh] max-w-[90vw] select-none overflow-hidden"
      //   style={{ aspectRatio }}
      style={{ height: "85vh", width: "90vw" }}
    >
      {/* Original Image (Full width) */}
      {/* <div className="absolute inset-0 z-0">
        <Image
          src={originalImageURL || "/placeholder.svg"}
          alt={`Original ${alt}`}
          fill
          className="object-contain"
          onError={(e) => {
            console.log("Original image load error:", originalImageURL);
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div> */}

      {/* Restored Image (Clipped by slider) */}
      {/* <div
        className="absolute inset-0 overflow-hidden z-10"
        style={{ width: `${sliderPosition}%` }}
      >
        <Image
          src={restoredImageURL || "/placeholder.svg"}
          alt={`Restored ${alt}`}
          fill
          className="object-contain"
          onError={(e) => {
            console.log("Restored image load error:", restoredImageURL);
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div> */}

      {/* Container for both images */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Original Image (Base layer) */}
        <Image
          src={originalImageURL || "/placeholder.svg"}
          alt={`Original ${alt}`}
          fill
          className="max-h-full max-w-full object-contain"
        />

        {/* Restored Image (Overlay with clip-path) */}
        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <Image
            src={restoredImageURL || "/placeholder.svg"}
            alt={`Restored ${alt}`}
            fill
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Slider Control */}
        <div
          className="absolute inset-y-0 z-20"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_5px_rgba(0,0,0,0.7)]"></div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-30"
          style={{ left: `calc(${sliderPosition}% - 16px)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex items-center justify-center">
            <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
        Restored
      </div>
      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded z-20">
        Original
      </div>
    </div>
  );
}
