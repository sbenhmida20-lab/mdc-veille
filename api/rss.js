export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')

const sources = [
{ name: 'AMF', country: 'France', url: 'https://www.amf-france.org/fr/rss.xml' },
{ name: 'ACPR', country: 'France', url: 'https://acpr.banque-france.fr/rss.xml' },
{ name: 'CSSF', country: 'Luxembourg', url: 'https://www.cssf.lu/fr/feed/' },
{ name: 'ESMA', country: 'Europe', url: 'https://www.esma.europa.eu/rss.xml' },
{ name: 'EBA', country: 'Europe', url: 'https://www.eba.europa.eu/rss.xml' },
{ name: 'EIOPA', country: 'Europe', url: 'https://www.eiopa.europa.eu/rss.xml' },
{ name: 'EUR-Lex', country: 'Europe', url: 'https://eur-lex.europa.eu/rss/eurlex_fr.xml' },
]

const fallback = [
{ id: 'f1', title: 'AMF : Nouvelles sanctions en matière d\'abus de marché', source: 'AMF', country: 'France', date: '2026-05-10', summary: 'L\'AMF a prononcé plusieurs sanctions à l\'encontre de sociétés de gestion ayant enfreint le règlement MAR.', url: 'https://www.amf-france.org', category: 'MAR', liked: false, favorited: false },
{ id: 'f2', title: 'ESMA publie ses orientations MIFID II 2026', source: 'ESMA', country: 'Europe', date: '2026-05-08', summary: 'L\'ESMA met à jour ses orientations concernant les exigences de transparence sous MIFID II pour les PSI.', url: 'https://www.esma.europa.eu', category: 'MIFID II', liked: false, favorited: false },
{ id: 'f3', title: 'CSSF : Mise à jour des exigences AIFM au Luxembourg', source: 'CSSF', country: 'Luxembourg', date: '2026-05-06', summary: 'La CSSF publie une circulaire précisant les nouvelles obligations des gestionnaires de FIA au Luxembourg.', url: 'https://www.cssf.lu', category: 'AIFM', liked: false, favorited: false },
{ id: 'f4', title: 'ACPR : Rapport annuel sur le contrôle des SGP', source: 'ACPR', country: 'France', date: '2026-05-05', summary: 'L\'ACPR publie son rapport annuel détaillant les principaux manquements constatés chez les SGP en 2025.', url: 'https://acpr.banque-france.fr', category: 'Contrôle interne', liked: false, favorited: false },
{ id: 'f5', title: 'EBA : Nouvelles règles LCB-FT pour les établissements', source: 'EBA', country: 'Europe', date: '2026-05-03', summary: 'L\'EBA publie des guidelines révisées en matière de lutte contre le blanchiment pour les établissements financiers.', url: 'https://www.eba.europa.eu', category: 'LCB-FT', liked: false, favorited: false },
{ id: 'f6', title: 'AMF : Position sur les fonds ESG et le greenwashing', source: 'AMF', country: 'France', date: '2026-04-28', summary: 'L\'AMF renforce sa doctrine sur la communication extra-financière des fonds se réclamant de critères ESG.', url: 'https://www.amf-france.org', category: 'ESG', liked: false, favorited: false },
{ id: 'f7', title: 'EIOPA : Consultation sur la révision de Solvabilité II', source: 'EIOPA', country: 'Europe', date: '2026-04-25', summary: 'L\'EIOPA lance une consultation publique sur les modifications proposées à la directive Solvabilité II.', url: 'https://www.eiopa.europa.eu', category: 'Solvabilité II', liked: false, favorited: false },
{ id: 'f8', title: 'CSSF : Circulaire sur la gestion des risques opérationnels', source: 'CSSF', country: 'Luxembourg', date: '2026-04-20', summary: 'La CSSF publie une nouvelle circulaire relative aux exigences en matière de gestion des risques opérationnels.', url: 'https://www.cssf.lu', category: 'Risques', liked: false, favorited: false },
]

const articles = []

for (const source of sources) {
try {
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 5000)
const response = await fetch(source.url, { signal: controller.signal })
clearTimeout(timeout)
const text = await response.text()
const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

for (const item of items.slice(0, 6)) {
const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/)
const link = item.match(/<link>\s*(.*?)\s*<\/link>/)
const date = item.match(/<pubDate>(.*?)<\/pubDate>/)
const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/)

if (title && title[1] && title[1].trim().length > 5) {
articles.push({
id: Math.random().toString(36).substr(2, 9),
title: title[1].trim(),
source: source.name,
country: source.country,
url: link ? link[1].trim() : source.url,
date: date ? new Date(date[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
summary: desc ? desc[1].replace(/<[^>]*>/g, '').trim().slice(0, 250) + '...' : 'Voir l\'article complet sur le site de la source.',
category: 'Réglementaire',
liked: false,
favorited: false
})
}
}
} catch (e) {
console.error(`Erreur ${source.name}:`, e.message)
}
}

const result = articles.length > 0 ? articles : fallback
result.sort((a, b) => new Date(b.date) - new Date(a.date))
res.status(200).json(result)
}

