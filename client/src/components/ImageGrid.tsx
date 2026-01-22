import { useState, useEffect, useCallback } from "react";

interface ImageGridProps {
  images: string[];
  loading: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="aspect-square bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Generating...</div>
    </div>
  );
}

function ImageModal({
  imageUrl,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalImages,
}: {
  imageUrl: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalImages: number;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPrev, onNext, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-4xl leading-none"
      >
        &times;
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl leading-none p-2"
      >
        &#8249;
      </button>

      <img
        src={imageUrl}
        alt="Full size UI Mockup"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-5xl leading-none p-2"
      >
        &#8250;
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {currentIndex + 1} / {totalImages}
      </div>
    </div>
  );
}

export function ImageGrid({ images, loading }: ImageGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + images.length) % images.length : null
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % images.length : null
    );
  }, [images.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {[0, 1, 2, 3].map((i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {images.map((url, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <img
              src={url}
              alt={`UI Mockup ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <ImageModal
          imageUrl={images[selectedIndex]}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={selectedIndex}
          totalImages={images.length}
        />
      )}
    </>
  );
}
