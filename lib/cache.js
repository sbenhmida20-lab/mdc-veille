// lib/cache.js
// Cache en mémoire simple, à l'échelle du process serverless (survit tant que
// l'instance Vercel reste "warm", ce qui suffit à absorber les rafraîchissements
// répétés d'un même utilisateur en quelques minutes).

const store = new Map();

/**
 * Récupère une valeur en cache si elle n'a pas expiré.
 */
export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

/**
 * Stocke une valeur en cache avec une durée de vie (ms).
 */
export function setCached(key, value, ttlMs = 5 * 60 * 1000) {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function clearCache() {
  store.clear();
}