import { PromptInput } from "./components/PromptInput";
import { ImageGrid } from "./components/ImageGrid";
import { HistoryGallery } from "./components/HistoryGallery";
import { useGenerateUI } from "./hooks/useGenerateUI";
import { useDesigns } from "./hooks/useDesigns";

function App() {
  const { designs, loading: historyLoading, refetch } = useDesigns();
  const { images, loading, error, generate } = useGenerateUI(refetch);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">UISpin</h1>
        <p className="text-gray-400">Generate UI mockups with AI</p>
      </header>

      <PromptInput onSubmit={generate} loading={loading} />

      {error && (
        <div className="mt-6 px-4 py-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-8">
          <ImageGrid images={images} loading={loading} />
        </div>
      )}

      <div className="mt-12 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Past Designs</h2>
        <HistoryGallery designs={designs} loading={historyLoading} />
      </div>
    </div>
  );
}

export default App;
