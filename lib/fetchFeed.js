// lib/fetchFeed.js
// Récupère et parse un flux RSS/Atom, avec timeout, et normalise chaque item
// vers un format unique quelle que soit la source.

import { XMLParser } from "fast-xml-parser";
import { cleanText, truncate } from "./cleanText.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
});

const DEFAULT_TIMEOUT_MS = 8000;

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function extractText(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  if (typeof field === "object" && "#text" in field) return field["#text"];
  return "";
}

function extractLink(item) {
  // RSS 2.0: <link>url</link>
  if (typeof item.link === "string") return item.link;
  // Atom: <link href="url" />  or array of <link>
  const links = toArray(item.link);
  const withHref = links.find((l) => l && l["@_href"]);
  if (withHref) return withHref["@_href"];
  return "";
}

function extractDate(item) {
  const raw =
    item.pubDate ||
    item.published ||
    item.updated ||
    (item["dc:date"] ?? null);
  const text = extractText(raw) || raw;
  const date = text ? new Date(text) : null;
  return date && !isNaN(date.getTime()) ? date.toISOString() : null;
}

function normalizeItem(rawItem, source) {
  const title = cleanText(extractText(rawItem.title));
  const link = extractLink(rawItem);
  const summaryRaw =
    extractText(rawItem.description) ||
    extractText(rawItem.summary) ||
    extractText(rawItem["content:encoded"]) ||
    extractText(rawItem.content);
  const date = extractDate(rawItem);

  return {
    id: link || `${source.id}-${title}`,
    title,
    summary: truncate(cleanText(summaryRaw)),
    link,
    date,
    sourceId: source.id,
    sourceName: source.name,
    country: source.country,
    category: source.category,
  };
}

/**
 * Fetch + parse un flux RSS. Ne lève jamais d'exception : en cas d'échec,
 * retourne { ok: false, error, source } pour que l'appelant puisse continuer
 * avec les autres sources.
 */
export async function fetchFeed(source, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MdC-Veille/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!res.ok) {
      return { ok: false, source: source.id, error: `HTTP ${res.status}` };
    }

    const xml = await res.text();
    if (!xml || xml.trim().length === 0) {
      return { ok: false, source: source.id, error: "Réponse vide" };
    }

    const parsed = parser.parse(xml);

    const items =
      toArray(parsed?.rss?.channel?.item) || // RSS 2.0
      toArray(parsed?.feed?.entry) || // Atom
      [];

    if (items.length === 0) {
      return { ok: false, source: source.id, error: "Aucun item trouvé" };
    }

    const articles = items
      .map((item) => normalizeItem(item, source))
      .filter((a) => a.title && a.link);

    return { ok: true, source: source.id, articles };
  } catch (err) {
    const message = err?.name === "AbortError" ? "Timeout" : err?.message || "Erreur inconnue";
    return { ok: false, source: source.id, error: message };
  } finally {
    clearTimeout(timeout);
  }
}