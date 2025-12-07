
import TeamBuilder from './components/TeamBuilder';

function App() {
  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{
          background: 'linear-gradient(to right, var(--accent-primary), var(--accent-secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem'
        }}>
          Team Builder
        </h1>
        <span style={{
          padding: '4px 8px',
          background: 'var(--bg-secondary)',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)'
        }}>
          Beta
        </span>
      </header>

      <main>
        <TeamBuilder />
      </main>
    </div>
  );
}

export default App;
