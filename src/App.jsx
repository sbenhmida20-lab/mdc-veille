import { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ArticleCard from './components/ArticleCard'
import './index.css'

const MOCK_ARTICLES = [
{ id: '1', title: 'AMF : Nouvelles sanctions en matière d\'abus de marché', source: 'AMF', country: 'France', date: '2026-05-10', summary: 'L\'AMF a prononcé plusieurs sanctions à l\'encontre de sociétés de gestion ayant enfreint le règlement MAR.', url: 'https://www.amf-france.org', category: 'MAR', liked: false, favorited: false },
{ id: '2', title: 'ESMA publie ses orientations MIFID II 2026', source: 'ESMA', country: 'Europe', date: '2026-05-08', summary: 'L\'ESMA met à jour ses orientations concernant les exigences de transparence sous MIFID II pour les PSI.', url: 'https://www.esma.europa.eu', category: 'MIFID II', liked: false, favorited: false },
{ id: '3', title: 'CSSF : Mise à jour des exigences AIFM au Luxembourg', source: 'CSSF', country: 'Luxembourg', date: '2026-05-06', summary: 'La CSSF publie une circulaire précisant les nouvelles obligations des gestionnaires de FIA au Luxembourg.', url: 'https://www.cssf.lu', category: 'AIFM', liked: false, favorited: false },
{ id: '4', title: 'ACPR : Rapport annuel sur le contrôle des SGP', source: 'ACPR', country: 'France', date: '2026-05-05', summary: 'L\'ACPR publie son rapport annuel détaillant les principaux manquements constatés chez les SGP en 2025.', url: 'https://acpr.banque-france.fr', category: 'Contrôle interne', liked: false, favorited: false },
{ id: '5', title: 'EBA : Nouvelles règles LCB-FT pour les établissements', source: 'EBA', country: 'Europe', date: '2026-05-03', summary: 'L\'EBA publie des guidelines révisées en matière de lutte contre le blanchiment pour les établissements financiers.', url: 'https://www.eba.europa.eu', category: 'LCB-FT', liked: false, favorited: false },
{ id: '6', title: 'AMF : Position sur les fonds ESG et le greenwashing', source: 'AMF', country: 'France', date: '2026-04-28', summary: 'L\'AMF renforce sa doctrine sur la communication extra-financière des fonds se réclamant de critères ESG.', url: 'https://www.amf-france.org', category: 'ESG', liked: false, favorited: false },
]

const SOURCES = ['AMF', 'ACPR', 'CSSF', 'ESMA', 'EBA', 'EIOPA']

export default function App() {
const [articles, setArticles] = useState(() => {
const saved = localStorage.getItem('mdc-articles')
return saved ? JSON.parse(saved) : MOCK_ARTICLES
})

const [filters, setFilters] = useState({
country: 'Tous',
source: 'Toutes',
dateFrom: '',
dateTo: '',
favoritesOnly: false
})

useEffect(() => {
localStorage.setItem('mdc-articles', JSON.stringify(articles))
}, [articles])

const handleLike = (id) => {
setArticles(prev => prev.map(a => a.id === id ? { ...a, liked: !a.liked } : a))
}

const handleFavorite = (id) => {
setArticles(prev => prev.map(a => a.id === id ? { ...a, favorited: !a.favorited } : a))
}

const filtered = articles.filter(a => {
if (filters.country !== 'Tous' && a.country !== filters.country) return false
if (filters.source !== 'Toutes' && a.source !== filters.source) return false
if (filters.dateFrom && a.date < filters.dateFrom) return false
if (filters.dateTo && a.date > filters.dateTo) return false
if (filters.favoritesOnly && !a.favorited) return false
return true
})

return (
<div style={{ minHeight: '100vh', backgroundColor: 'var(--grey)' }}>
<Header />
<div style={{ display: 'flex' }}>
<Sidebar filters={filters} setFilters={setFilters} sources={SOURCES} />
<main style={{ flex: 1, padding: '24px' }}>
<div style={{ marginBottom: '16px', color: 'var(--grey-dark)', fontSize: '14px' }}>
{filtered.length} actualité(s) trouvée(s)
</div>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
{filtered.map(article => (
<ArticleCard key={article.id} article={article} onLike={handleLike} onFavorite={handleFavorite} />
))}
</div>
</main>
</div>
</div>
)
}
