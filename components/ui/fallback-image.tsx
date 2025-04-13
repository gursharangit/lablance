'use client';
// components/ui/fallback-image.tsx
import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fallbackSrc?: string;
  className?: string;
}

export function FallbackImage({
  src,
  alt,
  width,
  height,
  fallbackSrc = "https://placehold.co/500x400?text=Image+Not+Found",
  className = "",
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
}