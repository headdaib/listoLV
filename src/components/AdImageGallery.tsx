"use client";

import { useState } from "react";
import Image from "next/image";

interface AdImageGalleryProps {
  images: { id: number; url: string; order: number }[];
  title: string;
}

export function AdImageGallery({ images, title }: AdImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-video bg-gray-950 flex items-center justify-center text-gray-700 text-6xl">
        📷
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-950">
        <Image
          src={images[selectedIndex].url}
          alt={title}
          fill
          className="object-contain transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto bg-gray-900/50">
          {images.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                selectedIndex === index ? "border-indigo-500 shadow-lg shadow-indigo-500/20" : "border-white/10 hover:border-gray-400"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
