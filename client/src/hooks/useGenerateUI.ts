import { useState } from "react";

interface GenerateState {
  images: string[];
  loading: boolean;
  error: string | null;
}

export function useGenerateUI() {
  const [state, setState] = useState<GenerateState>({
    images: [],
    loading: false,
    error: null,
  });

  const generate = async (prompt: string) => {
    setState({ images: [], loading: true, error: null });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate images");
      }

      const data = await response.json();
      setState({ images: data.images, loading: false, error: null });
    } catch (err) {
      setState({
        images: [],
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  return { ...state, generate };
}
