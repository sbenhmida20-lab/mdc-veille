export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*')

const sources = [
// 🇫🇷 FRANCE
{ name: 'AMF', country: 'France', url: 'https://www.amf-france.org/fr/rss.xml' },
{ name: 'AMF Sanctions', country: 'France', url: 'https://www.amf-france.org/fr/sanctions-et-transactions/rss.xml' },
{ name: 'ACPR', country: 'France', url: 'https://acpr.banque-france.fr/rss.xml' },
{ name: 'Legifrance', country: 'France', url: 'https://www.legifrance.gouv.fr/rss/jorf.xml' },
{ name: 'Banque de France', country: 'France', url: 'https://www.banque-france.fr/rss.xml' },
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

const fallback = [
{ id: 'f1', title: 'AMF : Nouvelles sanctions en matière d\'abus de marché', source: 'AMF', country: 'France', date: '2026-05-10', summary: 'L\'AMF a prononcé plusieurs sanctions à l\'encontre de sociétés de gestion ayant enfreint le règlement MAR. Ces décisions concernent des manquements aux obligations de déclaration et de prévention des abus de marché.', url: 'https://www.amf-france.org', category: 'Sanctions', liked: false, favorited: false },
{ id: 'f2', title: 'ESMA publie ses orientations MIFID II 2026', source: 'ESMA', country: 'Europe', date: '2026-05-08', summary: 'L\'ESMA met à jour ses orientations concernant les exigences de transparence sous MIFID II pour les PSI. Ces nouvelles orientations visent à harmoniser les pratiques de reporting au sein de l\'Union Européenne.', url: 'https://www.esma.europa.eu', category: 'MIFID II', liked: false, favorited: false },
{ id: 'f3', title: 'CSSF : Mise à jour des exigences AIFM au Luxembourg', source: 'CSSF', country: 'Luxembourg', date: '2026-05-06', summary: 'La CSSF publie une circulaire précisant les nouvelles obligations des gestionnaires de FIA au Luxembourg. Ce texte clarifie les modalités de calcul des ratios de levier et les obligations de reporting périodique.', url: 'https://www.cssf.lu', category: 'AIFM', liked: false, favorited: false },
{ id: 'f4', title: 'ACPR : Rapport annuel sur le contrôle des SGP', source: 'ACPR', country: 'France', date: '2026-05-05', summary: 'L\'ACPR publie son rapport annuel détaillant les principaux manquements constatés chez les SGP en 2025. Le rapport souligne des lacunes dans les dispositifs de contrôle interne et de gestion des conflits d\'intérêts.', url: 'https://acpr.banque-france.fr', category: 'Contrôle interne', liked: false, favorited: false },
{ id: 'f5', title: 'EBA : Nouvelles règles LCB-FT pour les établissements', source: 'EBA', country: 'Europe', date: '2026-05-03', summary: 'L\'EBA publie des guidelines révisées en matière de lutte contre le blanchiment pour les établissements financiers. Ces règles renforcent les obligations de vigilance et de déclaration de soupçon.', url: 'https://www.eba.europa.eu', category: 'LCB-FT', liked: false, favorited: false },
{ id: 'f6', title: 'AMF : Position sur les fonds ESG et le greenwashing', source: 'AMF', country: 'France', date: '2026-04-28', summary: 'L\'AMF renforce sa doctrine sur la communication extra-financière des fonds se réclamant de critères ESG. Les sociétés de gestion devront justifier leurs allégations avec des données vérifiables et comparables.', url: 'https://www.amf-france.org', category: 'ESG', liked: false, favorited: false },
{ id: 'f7', title: 'EIOPA : Consultation sur la révision de Solvabilité II', source: 'EIOPA', country: 'Europe', date: '2026-04-25', summary: 'L\'EIOPA lance une consultation publique sur les modifications proposées à la directive Solvabilité II. Les changements portent principalement sur les exigences de capital et les règles d\'investissement à long terme.', url: 'https://www.eiopa.europa.eu', category: 'Solvabilité', liked: false, favorited: false },
{ id: 'f8', title: 'CSSF : Circulaire sur la gestion des risques opérationnels', source: 'CSSF', country: 'Luxembourg', date: '2026-04-20', summary: 'La CSSF publie une nouvelle circulaire relative aux exigences en matière de gestion des risques opérationnels pour les PSF. Les établissements doivent renforcer leurs plans de continuité d\'activité.', url: 'https://www.cssf.lu', category: 'Gestion des risques', liked: false, favorited: false },
]

function extractText(xml, tag) {
const cdataMatch = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
if (cdataMatch) return cdataMatch[1].trim()
const plainMatch = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))
if (plainMatch) return plainMatch[1].replace(/<[^>]*>/g, '').trim()
return ''
}

function cleanText(text) {
return text
.replace(/<[^>]*>/g, '')
.replace(/&amp;/g, '&')
.replace(/&lt;/g, '<')
.replace(/&gt;/g, '>')
.replace(/&quot;/g, '"')
.replace(/&#039;/g, "'")
.replace(/&nbsp;/g, ' ')
.replace(/\s+/g, ' ')
.trim()
}

function getCategory(title, summary) {
const text = (title + ' ' + summary).toLowerCase()
if (text.includes('abus de marché') || text.includes('mar') || text.includes('market abuse')) return 'Abus de marché'
if (text.includes('mifid') || text.includes('mifir')) return 'MIFID II'
if (text.includes('aifm') || text.includes('fia') || text.includes('aifmd')) return 'AIFM'
if (text.includes('opcvm') || text.includes('ucits')) return 'OPCVM'
if (text.includes('lcb') || text.includes('blanchiment') || text.includes('aml')) return 'LCB-FT'
if (text.includes('esg') || text.includes('durabilité') || text.includes('sustainability')) return 'ESG'
if (text.includes('solvabilité') || text.includes('solvency')) return 'Solvabilité'
if (text.includes('risque') || text.includes('risk')) return 'Gestion des risques'
if (text.includes('agrément') || text.includes('authorisation')) return 'Agrément'
if (text.includes('sanction') || text.includes('enforcement')) return 'Sanctions'
return 'Réglementaire'
}

const articles = []

for (const source of sources) {
try {
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 8000)
const response = await fetch(source.url, {
signal: controller.signal,
headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MDC-Veille/1.0)' }
})
clearTimeout(timeout)
const text = await response.text()
const items = text.match(/<item>([\s\S]*?)<\/item>/g) || []

for (const item of items.slice(0, 8)) {
const title = cleanText(extractText(item, 'title'))
const link = extractText(item, 'link') || extractText(item, 'guid')
const date = extractText(item, 'pubDate')
let summary = cleanText(extractText(item, 'description'))

if (!summary || summary.length < 20) {
summary = cleanText(extractText(item, 'content:encoded'))
}
if (summary.length > 350) {
summary = summary.slice(0, 350) + '...'
}
if (!summary || summary.length < 20) {
summary = `Publication de ${source.name} — cliquez pour lire l'article complet.`
}

if (title && title.length > 5) {
articles.push({
id: Math.random().toString(36).substr(2, 9),
title,
source: source.name,
country: source.country,
url: link || source.url,
date: date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
summary,
category: getCategory(title, summary),
liked: false,
favorited: false
})
}
}
} catch (e) {
console.error(`Erreur ${source.name}:`, e.message)
}
}

const result = articles.length > 3 ? articles : fallback
result.sort((a, b) => new Date(b.date) - new Date(a.date))
res.status(200).json(result)
}
