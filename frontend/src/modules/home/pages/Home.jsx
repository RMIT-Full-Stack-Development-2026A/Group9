import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1120', color: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center', background: '#13203a', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)' }}>
        <h1 style={{ margin: 0, fontSize: '2.25rem' }}>Welcome to TicTacToang</h1>
        <p style={{ marginTop: '1rem', color: '#cbd5e1', lineHeight: 1.7 }}>
          Your registration page is ready. Click below to open the signup form and create your player account.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to="/register" style={{ padding: '0.95rem 1.5rem', background: '#06b6d4', color: '#000', borderRadius: '999px', fontWeight: 700, textDecoration: 'none' }}>
            Go to Register
          </Link>
          <Link to="/login" style={{ padding: '0.95rem 1.5rem', border: '1px solid #475569', color: '#f8fafc', borderRadius: '999px', textDecoration: 'none' }}>
            Login Page
          </Link>
        </div>
      </div>
    </div>
  );
}
