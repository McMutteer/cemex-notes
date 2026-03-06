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
  techStack: ["Vite", "React 19", "TypeScript", "Tailwind CSS v4"],
  links: {
    repo: "https://github.com/McMutteer/cemex-notes",
  },
  journey: [
    {
      skill: "baptism",
      label: "Nombrado como C-Notes",
      completedAt: "2026-03-05",
    },
    {
      skill: "master-plan",
      label: "13 pantallas de tracking de colados",
      completedAt: "2026-03-05",
    },
    {
      skill: "add-hub-service",
      label: "Debut en el hub de nqual5",
      completedAt: "2026-03-05",
    },
  ],
  brand: {
    primaryColor: "#DF343D",
    accentColor: "#293064",
  },
  meta: {
    createdAt: "2026-03-05",
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

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  return res.json(card);
}
