import { useEffect, useState } from "react";
import { apiFetch } from "./api";
import { defaultContent } from "./defaultContent";

function migrateLegacyContent(savedContent) {
  const content = structuredClone(savedContent || {});
  const legacyHeroTitles = [
    "Fabrication 3D, covering premium & rénovation design",
    "L'impression 3D est devenue accessible.",
  ];

  if (legacyHeroTitles.includes(content.hero?.title)) {
    content.hero = {
      ...content.hero,
      badge: "Conception • Fabrication • Transformation — Normandie",
      title: "Des idées techniques.",
      highlight: "Des réalisations qui ont du caractère.",
      description:
        "MecaPrint3D réunit trois expertises complémentaires : fabrication numérique et ingénierie, rénovation design premium, et aménagement intérieur ou extérieur sur mesure.",
      secondaryButton: "Découvrir nos univers",
    };
  }

  const universItems = content.univers?.items;
  if (Array.isArray(universItems)) {
    content.univers.items = universItems.map((item) =>
      item.title === "CAMPER"
        ? {
            ...item,
            title: "HOME & OUTDOOR",
            subtitle: "Maison, jardin & acier Corten",
            description:
              "Décoration, mobilier, bordures de jardin, jardinières, claustras et créations en acier Corten.",
            link: "#corten",
          }
        : item
    );
  }

  return content;
}

export function useSiteContent() {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiFetch("/api/site-content")
      .then((data) => {
        if (!cancelled && data.content) {
          setContent({
            ...defaultContent,
            ...migrateLegacyContent(data.content),
          });
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
