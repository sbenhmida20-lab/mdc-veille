export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')

const sources = [
// 🇫🇷 FRANCE
{ name: 'AMF', country: 'France', url: 'https://www.amf-france.org/fr/rss.xml' },
{ name: 'ACPR', country: 'France', url: 'https://acpr.banque-france.fr/rss.xml' },
{ name: 'Legifrance', country: 'France', url: 'https://www.legifrance.gouv.fr/rss/jorf.xml' },
{ name: 'Banque de France', country: 'France', url: 'https://www.banque-france.fr/rss.xml' },
{ name: 'AMF Sanctions', country: 'France', url: 'https://www.amf-france.org/fr/sanctions-et-transactions/rss.xml' },
// 🇱🇺 LUXEMBOURG
{ name: 'CSSF', country: 'Luxembourg', url: 'https://www.cssf.lu/fr/feed/' },
{ name: 'CSSF Communiqués', country: 'Luxembourg', url: 'https://www.cssf.lu/fr/category/communiques/feed/' },
{ name: 'BCL', country: 'Luxembourg', url: 'https://www.bcl.lu/fr/rss/publications.xml' },
// 🇪🇺 EUROPE
{ name: 'ESMA', country: 'Europe', url: 'https://www.esma.europa.eu/rss.xml' },
{ name: 'EBA', country: 'Europe', url: 'https://www.eba.europa.eu/rss.xml' },
{ name: 'EIOPA', country: 'Europe', url: 'https://www.eiopa.europa.eu/rss.xml' },
{ name: 'ECB', country: 'Europe', url: 'https://www.ecb.europa.eu/rss/press.html' },
{ name: 'EUR-Lex', country: 'Europe', url: 'https://eur-lex.europa.eu/rss/eurlex_fr.xml' },
{ name: 'Commission Européenne', country: 'Europe', url: 'https://ec.europa.eu/commission/presscorner/api/rss' },
{ name: 'ESRB', country: 'Europe', url: 'https://www.esrb.europa.eu/rss/news.xml' },
]

const articles = []

for (const source of sources) {
try {
const response = await fetch(source.url)
const text = await response.text()

const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

for (const item of items.slice(0, 5)) {
const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/)
const link = item.match(/<link>(.*?)<\/link>/)
const date = item.match(/<pubDate>(.*?)<\/pubDate>/)
const desc = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/)

if (title && title[1]) {
articles.push({
id: Math.random().toString(36).substr(2, 9),
title: title[1].trim(),
source: source.name,
country: source.country,
url: link ? link[1].trim() : '#',
date: date ? new Date(date[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
summary: desc ? desc[1].replace(/<[^>]*>/g, '').trim().slice(0, 200) + '...' : '',
category: 'Réglementaire',
liked: false,
favorited: false
})
}
}
} catch (e) {
console.error(`Erreur ${source.name}:`, e)
}
}

articles.sort((a, b) => new Date(b.date) - new Date(a.date))
res.status(200).json(articles)
}
