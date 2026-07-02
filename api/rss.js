// api/rss.js
// Endpoint principal : GET /api/rss?country=FR&source=amf-actualites&days=15
//
// Query params (tous optionnels) :
//   country  = "FR" | "LU" | "EU" | "Tous" (défaut: Tous)
//   source   = id d'une source précise (défaut: Toutes)
//   days     = nombre de jours à remonter (défaut: pas de filtre)
//   dateFrom = ISO date, filtre borne basse (prioritaire sur "days")
//   dateTo   = ISO date, filtre borne haute
//   noCache  = "1" pour forcer un refresh complet

import { selectSources } from "../lib/sources.js";
import { fetchFeed } from "../lib/fetchFeed.js";
import { getCached, setCached } from "../lib/cache.js";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function dedupeAndSort(articles) {
  const seen = new Set();
  const unique = [];
  for (const a of articles) {
    const key = a.link || a.id;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(a);
  }
  unique.sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
  return unique;
}

function applyDateFilter(articles, { days, dateFrom, dateTo }) {
  let from = dateFrom ? new Date(dateFrom) : null;
  let to = dateTo ? new Date(dateTo) : null;

  if (!from && days) {
    from = new Date();
    from.setDate(from.getDate() - Number(days));
  }

  if (!from && !to) return articles;

  return articles.filter((a) => {
    if (!a.date) return true; // on garde les items sans date plutôt que de les perdre
    const d = new Date(a.date);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const { country, source: sourceId, days, dateFrom, dateTo, noCache } = req.query;

  const sources = selectSources({ country, sourceId });

  if (sources.length === 0) {
    res.status(400).json({ error: "Aucune source ne correspond aux filtres fournis" });
    return;
  }

  const cacheKey = `rss:${country || "Tous"}:${sourceId || "Toutes"}`;

  if (!noCache) {
    const cached = getCached(cacheKey);
    if (cached) {
      res.status(200).json({ ...cached, cached: true });
      return;
    }
  }

  const results = await Promise.allSettled(sources.map((s) => fetchFeed(s)));

  const allArticles = [];
  const errors = [];

  for (const result of results) {
    if (result.status !== "fulfilled") {
      errors.push({ source: "unknown", error: result.reason?.message || "Erreur inconnue" });
      continue;
    }
    const feedResult = result.value;
    if (feedResult.ok) {
      allArticles.push(...feedResult.articles);
    } else {
      errors.push({ source: feedResult.source, error: feedResult.error });
    }
  }

  let articles = dedupeAndSort(allArticles);
  articles = applyDateFilter(articles, { days, dateFrom, dateTo });

  const payload = {
    articles,
    meta: {
      total: articles.length,
      sourcesQueried: sources.length,
      sourcesOk: sources.length - errors.length,
      errors,
      generatedAt: new Date().toISOString(),
    },
  };

  setCached(cacheKey, payload, CACHE_TTL_MS);

  res.status(200).json({ ...payload, cached: false });
}