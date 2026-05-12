import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import { defaultContent } from "./defaultContent";

export function useSiteContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/api/site-content")
      .then((data) => {
        if (!cancelled && data.content) {
          setContent({ ...defaultContent, ...data.content });
        }
      })
      .catch((error) => {
        console.warn("Contenu dynamique indisponible, contenu par défaut utilisé.", error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading, setContent };
}
