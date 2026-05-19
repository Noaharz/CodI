import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { user, signInWithToken, error, loading } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    if (token.trim()) {
      await signInWithToken(token.trim());
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Code Reviewer</h1>
        <p className={styles.subtitle}>GitHub + AI Code Review</p>

        {error && (
          <div className={styles.error}>
            <p>❌ Error: {error}</p>
          </div>
        )}

        {!showTokenInput ? (
          <>
            <button
              onClick={() => setShowTokenInput(true)}
              className={styles.button}
              disabled={loading}
            >
              <span className={styles.icon}>🐙</span>
              {loading ? 'Signing in...' : 'Sign in with GitHub'}
            </button>

            <div className={styles.features}>
              <h3>Features:</h3>
              <ul>
                <li>🔐 Secure GitHub authentication</li>
                <li>📦 Browse all your repositories</li>
                <li>🤖 AI-powered code review</li>
                <li>💻 Terminal-style output</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleTokenSubmit} className={styles.tokenForm}>
              <label className={styles.label}>
                GitHub Personal Access Token
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your GitHub token here..."
                className={styles.tokenInput}
                disabled={loading}
              />
              <p className={styles.hint}>
                📋 Create a token at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/settings/tokens
                </a>
                <br />
                ✅ Select scopes: <code>repo</code>, <code>read:user</code>
              </p>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  className={styles.button}
                  disabled={!token.trim() || loading}
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTokenInput(false);
                    setToken('');
                  }}
                  className={styles.buttonSecondary}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
