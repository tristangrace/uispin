import { Design } from "../hooks/useDesigns";
import { ImageGrid } from "./ImageGrid";

interface HistoryGalleryProps {
  designs: Design[];
  loading: boolean;
}

export function HistoryGallery({ designs, loading }: HistoryGalleryProps) {
  if (loading) {
    return (
      <div className="text-center text-gray-400 py-12">Loading history...</div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No designs yet. Generate your first UI mockup!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-16 w-full items-center">
      {designs.map((design) => (
        <div key={design.id} className="w-full max-w-4xl">
          <div className="mb-4">
            <p className="text-lg font-medium text-gray-200">{design.prompt}</p>
            <p className="text-sm text-gray-500">
              {new Date(design.createdAt).toLocaleString()}
            </p>
          </div>
          <ImageGrid images={design.images} loading={false} />
        </div>
      ))}
    </div>
  );
}

