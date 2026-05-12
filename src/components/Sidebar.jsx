function Sidebar({ filters, setFilters, sources }) {
return (
<div style={{
width: '260px',
minWidth: '260px',
backgroundColor: 'var(--navy)',
padding: '24px 16px',
display: 'flex',
flexDirection: 'column',
gap: '24px',
minHeight: '100vh'
}}>
<div>
<p style={{ color: 'var(--gold)', fontWeight: '700', marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase' }}>Pays</p>
{['Tous', 'France', 'Luxembourg', 'Europe'].map(p => (
<div key={p} onClick={() => setFilters(f => ({ ...f, country: p }))}
style={{
padding: '8px 12px',
borderRadius: '8px',
cursor: 'pointer',
color: filters.country === p ? 'var(--navy)' : 'var(--white)',
backgroundColor: filters.country === p ? 'var(--gold)' : 'transparent',
marginBottom: '4px',
fontSize: '14px'
}}>
{p === 'France' ? '🇫🇷' : p === 'Luxembourg' ? '🇱🇺' : p === 'Europe' ? '🇪🇺' : '🌍'} {p}
</div>
))}
</div>

<div>
<p style={{ color: 'var(--gold)', fontWeight: '700', marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase' }}>Source</p>
{['Toutes', ...sources].map(s => (
<div key={s} onClick={() => setFilters(f => ({ ...f, source: s }))}
style={{
padding: '8px 12px',
borderRadius: '8px',
cursor: 'pointer',
color: filters.source === s ? 'var(--navy)' : 'var(--white)',
backgroundColor: filters.source === s ? 'var(--gold)' : 'transparent',
marginBottom: '4px',
fontSize: '14px'
}}>
{s}
</div>
))}
</div>

<div>
<p style={{ color: 'var(--gold)', fontWeight: '700', marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase' }}>Période</p>
<input type="date" value={filters.dateFrom}
onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none', marginBottom: '8px', fontSize: '13px' }} />
<input type="date" value={filters.dateTo}
onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
style={{ width: '100%', padding: '8px', borderRadius: '8px', border: 'none', fontSize: '13px' }} />
</div>

<div>
<p style={{ color: 'var(--gold)', fontWeight: '700', marginBottom: '10px', fontSize: '13px', textTransform: 'uppercase' }}>Afficher</p>
<div onClick={() => setFilters(f => ({ ...f, favoritesOnly: !f.favoritesOnly }))}
style={{
padding: '8px 12px',
borderRadius: '8px',
cursor: 'pointer',
color: filters.favoritesOnly ? 'var(--navy)' : 'var(--white)',
backgroundColor: filters.favoritesOnly ? 'var(--gold)' : 'transparent',
fontSize: '14px'
}}>
⭐ Favoris uniquement
</div>
</div>
</div>
)
}

export default Sidebar