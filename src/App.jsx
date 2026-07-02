import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ArticleCard from './components/ArticleCard'
import './index.css'

const SOURCES = [
  'AMF - Actualités', 'AMF - Sanctions', 'AMF - Doctrine',
  'Legifrance', 'CSSF', 'CSSF - Communiqués',
  'Banque Centrale du Luxembourg',
  'ESMA', 'EBA', 'EIOPA', 'EUR-Lex', 'Commission Européenne'
]

export default function App() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    country: 'Tous',
    source: 'Toutes',
    dateFrom: '',
    dateTo: '',
    favoritesOnly: false
  })

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/rss')
      const data = await res.json()
      const list = data.articles || []
      const saved = JSON.parse(localStorage.getItem('mdc-interactions') || '{}')
      const merged = list.map(a => ({
        ...a,
        source: a.sourceName,
        liked: saved[a.id]?.liked || false,
        favorited: saved[a.id]?.favorited || false
      }))
      setArticles(merged)
    } catch (e) {
      console.error('Erreur fetch:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const saveInteractions = (updated) => {
    const interactions = {}
    updated.forEach(a => {
      if (a.liked || a.favorited) {
        interactions[a.id] = { liked: a.liked, favorited: a.favorited }
      }
    })
    localStorage.setItem('mdc-interactions', JSON.stringify(interactions))
  }

  const handleLike = (id) => {
    const updated = articles.map(a => a.id === id ? { ...a, liked: !a.liked } : a)
    setArticles(updated)
    saveInteractions(updated)
  }

  const handleFavorite = (id) => {
    const updated = articles.map(a => a.id === id ? { ...a, favorited: !a.favorited } : a)
    setArticles(updated)
    saveInteractions(updated)
  }

  const countryMap = { France: 'FR', Luxembourg: 'LU', Europe: 'EU' }

  const filtered = articles.filter(a => {
    if (filters.country !== 'Tous' && a.country !== (countryMap[filters.country] || filters.country)) return false
    if (filters.source !== 'Toutes' && a.source !== filters.source) return false
    if (filters.dateFrom && a.date < filters.dateFrom) return false
    if (filters.dateTo && a.date > filters.dateTo) return false
    if (filters.favoritesOnly && !a.favorited) return false
    return true
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--grey)' }}>
      <Header onRefresh={fetchArticles} />
      <div style={{ display: 'flex' }}>
        <Sidebar filters={filters} setFilters={setFilters} sources={SOURCES} />
        <main style={{ flex: 1, padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--navy)', fontSize: '16px' }}>
              ⏳ Chargement des actualités...
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px', color: 'var(--grey-dark)', fontSize: '14px' }}>
                {filtered.length} actualité(s) trouvée(s)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
                {filtered.map(article => (
                  <ArticleCard key={article.id} article={article} onLike={handleLike} onFavorite={handleFavorite} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}