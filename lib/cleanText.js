// lib/cleanText.js
// Nettoyage du texte brut issu des flux RSS (HTML, entités, chemins de fichiers, URLs isolées)

const HTML_ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&rsquo;": "'",
  "&lsquo;": "'",
  "&rdquo;": '"',
  "&ldquo;": '"',
  "&hellip;": "...",
  "&eacute;": "é",
  "&egrave;": "è",
  "&ecirc;": "ê",
  "&euml;": "ë",
  "&agrave;": "à",
  "&acirc;": "â",
  "&ccedil;": "ç",
  "&ocirc;": "ô",
  "&ugrave;": "ù",
  "&ucirc;": "û",
  "&icirc;": "î",
  "&iuml;": "ï",
  "&laquo;": "«",
  "&raquo;": "»",
};

export function cleanText(raw) {
  if (!raw || typeof raw !== "string") return "";

  let text = raw;

  // Supprime les blocs <style> et <script> entiers
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Supprime toutes les balises HTML restantes
  text = text.replace(/<\/?[a-z][^>]*>/gi, " ");

  // Décode les entités HTML connues
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    text = text.split(entity).join(char);
  }
  // Décode les entités numériques (&#123;)
  text = text.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));

  // Supprime les URLs isolées et chemins de fichiers (ex: /sites/default/files/...)
  text = text.replace(/https?:\/\/\S+/g, "");
  text = text.replace(/\/sites\/[^\s]+/g, "");
  text = text.replace(/\S+\.(pdf|docx?|xlsx?)\b/gi, "");

  // Normalise les espaces
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

export function truncate(text, maxLength = 220) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}  