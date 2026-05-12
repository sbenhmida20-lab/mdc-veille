function Header() {
return (
<header style={{
backgroundColor: 'var(--navy)',
padding: '16px 32px',
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
<div style={{
width: '40px',
height: '40px',
backgroundColor: 'var(--gold)',
borderRadius: '8px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
fontWeight: 'bold',
color: 'var(--navy)',
fontSize: '16px'
}}>MC</div>
<div>
<div style={{ color: 'var(--white)', fontWeight: '700', fontSize: '18px' }}>
Maison de la Compliance
</div>
<div style={{ color: 'var(--gold)', fontSize: '12px' }}>
Veille Réglementaire
</div>
</div>
</div>
<div style={{ color: 'var(--grey-dark)', fontSize: '13px' }}>
{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
</div>
</header>
)
}

export default Header
