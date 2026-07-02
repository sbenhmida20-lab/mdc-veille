// lib/sources.js
// Configuration centralisée de toutes les sources de veille réglementaire.
// Pour ajouter une source : ajoute une entrée ici, rien d'autre à toucher.

export const SOURCES = [
  // ---- France ----
  {
    id: "amf-actualites",
    name: "AMF - Actualités",
    country: "FR",
    category: "Régulateur",
    url: "https://www.amf-france.org/fr/flux-rss/display/30",
  },
  {
    id: "amf-sanctions",
    name: "AMF - Sanctions",
    country: "FR",
    category: "Sanctions",
    url: "https://www.amf-france.org/fr/flux-rss/display/21",
  },
  {
    id: "amf-doctrine",
    name: "AMF - Doctrine",
    country: "FR",
    category: "Doctrine",
    url: "https://www.amf-france.org/fr/flux-rss/display/25",
  },
  {
    id: "legifrance",
    name: "Legifrance",
    country: "FR",
    category: "Textes légaux",
    url: "https://www.legifrance.gouv.fr/rss/dernieres-publications.rss",
  },

  // ---- Luxembourg ----
  {
    id: "cssf",
    name: "CSSF",
    country: "LU",
    category: "Régulateur",
    url: "https://www.cssf.lu/en/feed/",
  },
  {
    id: "cssf-communiques",
    name: "CSSF - Communiqués",
    country: "LU",
    category: "Communiqués",
    url: "https://www.cssf.lu/en/category/communiques/feed/",
  },
  {
    id: "bcl",
    name: "Banque Centrale du Luxembourg",
    country: "LU",
    category: "Régulateur",
    url: "https://www.bcl.lu/fr/rss/rss.xml",
  },

  // ---- Europe ----
  {
    id: "esma",
    name: "ESMA",
    country: "EU",
    category: "Régulateur",
    url: "https://www.esma.europa.eu/rss.xml",
  },
  {
    id: "eba",
    name: "EBA",
    country: "EU",
    category: "Régulateur",
    url: "https://www.eba.europa.eu/rss.xml",
  },
  {
    id: "eiopa",
    name: "EIOPA",
    country: "EU",
    category: "Régulateur",
    url: "https://www.eiopa.europa.eu/rss_en",
  },
  {
    id: "eurlex",
    name: "EUR-Lex",
    country: "EU",
    category: "Textes légaux",
    url: "https://eur-lex.europa.eu/EN/display-feed.rss",
  },
  {
    id: "commission-ue",
    name: "Commission Européenne",
    country: "EU",
    category: "Institution",
    url: "https://ec.europa.eu/commission/presscorner/api/rss?text=&itemPerPage=25&language=fr",
  },
];

// Helper pour filtrer les sources actives à interroger selon les query params
export function selectSources({ country, sourceId } = {}) {
  return SOURCES.filter((s) => {
    if (country && country !== "Tous" && s.country !== country) return false;
    if (sourceId && sourceId !== "Toutes" && s.id !== sourceId) return false;
    return true;
  });
}