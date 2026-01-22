import { useState, useEffect, useCallback } from "react";

export interface Design {
  id: string;
  prompt: string;
  createdAt: string;
  images: string[];
}

interface DesignsState {
  designs: Design[];
  loading: boolean;
  error: string | null;
}

export function useDesigns() {
  const [state, setState] = useState<DesignsState>({
    designs: [],
    loading: true,
    error: null,
  });

  const fetchDesigns = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch("/api/designs");
      if (!response.ok) {
        throw new Error("Failed to fetch designs");
      }
      const data = await response.json();
      setState({ designs: data.designs, loading: false, error: null });
    } catch (err) {
      setState({
        designs: [],
        loading: false,
        error: err instanceof Error ? err.message : "An error occurred",
      });
    }
  }, []);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return { ...state, refetch: fetchDesigns };
}
