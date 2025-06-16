"use client";

import type React from "react";
import Image from "next/image";
import { photoInterface } from "@/lib/types/photoInterface";

interface PhotoContainerProps {
  photo: photoInterface;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function PhotoContainer({
  photo,
  onClick,
  style,
}: PhotoContainerProps) {
  return (
    <div
      className="relative w-full h-full cursor-pointer transition-transform hover:brightness-90"
      onClick={onClick}
    >
      <Image
        src={photo.presigned_url_thumbnail}
        alt={photo.file_name}
        width={300}
        height={300}
        className="w-full h-full object-cover rounded-lg"
        style={style}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPQX3bPQAAAABJRU5ErkJggg==" // universal blur placeholder
        onError={(e) => {
          e.currentTarget.src = "/placeholder.png"; // if the image is not loaded, show the placeholder image
        }}
      />
    </div>
  );
}