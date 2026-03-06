import type { VercelRequest, VercelResponse } from "@vercel/node";

const card = {
  name: "C-Notes",
  tagline: "Control de Colados CEMEX",
  url: "https://c-notes.nqual5.com",
  description:
    "App móvil de tracking de colados de concreto para obras de construcción CEMEX",
  stats: [
    { label: "Pantallas", value: "13", trend: "up" },
    { label: "Líneas de Código", value: "4,107", trend: "up" },
    { label: "PRs Mergeados", value: "3", trend: "up" },
  ],
  features: [
    {
      title: "Tracking de CRs",
      description:
        "Registro de camiones revolvedores con tiempos, temperaturas y volúmenes",
    },
    {
      title: "Mapeo sobre Plano",
      description:
        "Dibujo de áreas de colado y marcadores sobre blueprints",
    },
    {
      title: "Firma Digital",
      description:
        "Cierre de sesión con firma dual (Residente + Coordinador CEMEX)",
    },
    {
      title: "Evidencia Fotográfica",
      description:
        "Captura y organización de fotos con descripciones obligatorias",
    },
  ],
  techStack: ["Vite", "React", "TypeScript", "Tailwind CSS"],
  brand: {
    primaryColor: "#DF343D",
    accentColor: "#293064",
  },
};

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "https://nqual5.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  return res.json(card);
}
