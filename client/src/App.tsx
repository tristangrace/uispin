import { PromptInput } from "./components/PromptInput";
import { ImageGrid } from "./components/ImageGrid";
import { useGenerateUI } from "./hooks/useGenerateUI";

function App() {
  const { images, loading, error, generate } = useGenerateUI();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">UISpin</h1>
        <p className="text-gray-400">Generate UI mockups with AI</p>
      </header>

      <PromptInput onSubmit={generate} loading={loading} />

      {error && (
        <div className="mt-6 px-4 py-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="mt-8">
        <ImageGrid images={images} loading={loading} />
      </div>
    </div>
  );
}

export default App;
