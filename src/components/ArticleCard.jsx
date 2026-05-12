function ArticleCard({ article, onLike, onFavorite }) {
const countryFlag = {
'France': '🇫🇷',
'Luxembourg': '🇱🇺',
'Europe': '🇪🇺'
}

return (
<div style={{
backgroundColor: 'var(--white)',
borderRadius: '12px',
padding: '20px',
boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
borderLeft: '4px solid var(--gold)',
display: 'flex',
flexDirection: 'column',
gap: '10px'
}}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
<span style={{
backgroundColor: 'var(--navy)',
color: 'var(--gold)',
padding: '3px 10px',
borderRadius: '20px',
fontSize: '11px',
fontWeight: '600'
}}>
{countryFlag[article.country]} {article.source}
</span>
<div style={{ display: 'flex', gap: '8px' }}>
<button onClick={() => onLike(article.id)} style={{
background: 'none',
border: 'none',
cursor: 'pointer',
fontSize: '18px'
}}>
{article.liked ? '❤️' : '🤍'}
</button>
<button onClick={() => onFavorite(article.id)} style={{
background: 'none',
border: 'none',
cursor: 'pointer',
fontSize: '18px'
}}>
{article.favorited ? '⭐' : '☆'}
</button>
</div>
</div>

<a href={article.url} target="_blank" rel="noreferrer" style={{
color: 'var(--navy)',
fontWeight: '700',
fontSize: '15px',
textDecoration: 'none',
lineHeight: '1.4'
}}>
{article.title}
</a>

<p style={{ color: 'var(--grey-dark)', fontSize: '13px', lineHeight: '1.6' }}>
{article.summary}
</p>

<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--grey-dark)' }}>
<span>{article.category}</span>
<span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
</div>
</div>
)
}

export default ArticleCard
