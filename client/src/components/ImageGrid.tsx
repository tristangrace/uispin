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

export function ImageGrid({ images, loading }: ImageGridProps) {
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
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
      {images.map((url, index) => (
        <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={url}
            alt={`UI Mockup ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
