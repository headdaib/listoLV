"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export function ImageUploader({ onImagesChange, maxImages = 5 }: ImageUploaderProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    
    if (images.length + newFiles.length > maxImages) {
      alert(`Можно загрузить не более ${maxImages} фото.`);
      return;
    }

    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);
    onImagesChange(updatedImages);

    // Generate previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke old object URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-white/5"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="text-4xl mb-3">📸</div>
        <p className="text-gray-300 font-medium">Нажмите или перетащите фото сюда</p>
        <p className="text-gray-500 text-sm mt-1">До {maxImages} изображений (JPG, PNG)</p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={preview} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
              <Image src={preview} alt={`Preview ${index}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
