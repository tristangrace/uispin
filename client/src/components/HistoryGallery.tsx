import { useState } from "react";
import { Design } from "../hooks/useDesigns";
import { ImageGrid } from "./ImageGrid";

function DesignCard({
  design,
  onSelect,
}: {
  design: Design;
  onSelect: (design: Design) => void;
}) {
  return (
    <button
      onClick={() => onSelect(design)}
      className="text-left bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
    >
      <img
        src={design.images[0]}
        alt={design.prompt}
        className="w-full aspect-square object-cover rounded-lg mb-3"
      />
      <p className="text-sm text-gray-300 line-clamp-2">{design.prompt}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(design.createdAt).toLocaleDateString()}
      </p>
    </button>
  );
}

function DesignModal({
  design,
  onClose,
}: {
  design: Design;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-lg font-medium">{design.prompt}</p>
            <p className="text-sm text-gray-500">
              {new Date(design.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <ImageGrid images={design.images} loading={false} />
      </div>
    </div>
  );
}

interface HistoryGalleryProps {
  designs: Design[];
  loading: boolean;
}

export function HistoryGallery({ designs, loading }: HistoryGalleryProps) {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

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
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {designs.map((design) => (
          <DesignCard
            key={design.id}
            design={design}
            onSelect={setSelectedDesign}
          />
        ))}
      </div>
      {selectedDesign && (
        <DesignModal
          design={selectedDesign}
          onClose={() => setSelectedDesign(null)}
        />
      )}
    </>
  );
}
