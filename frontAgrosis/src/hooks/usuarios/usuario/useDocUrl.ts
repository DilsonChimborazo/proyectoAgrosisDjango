import { useState, useEffect } from "react";

export function useDocUrl() {
  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch("/config.json")
      .then((response) => response.json())
      .then((config) => {
        setDocUrl(config.VITE_DOC_URL);
      })
      .catch((err) => console.error("Error cargando config.json:", err));
  }, []);

  return docUrl;
}