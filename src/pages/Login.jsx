import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { user, signInWithGithub, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Code Reviewer</h1>
        <p className={styles.subtitle}>GitHub + AI Code Review</p>

        {error && (
          <div className={styles.error}>
            <p>Error: {error}</p>
          </div>
        )}

        <button
          onClick={signInWithGithub}
          className={styles.button}
        >
          <span className={styles.icon}>🐙</span>
          Sign in with GitHub
        </button>

        <div className={styles.features}>
          <h3>Features:</h3>
          <ul>
            <li>🔐 Secure GitHub OAuth login</li>
            <li>📦 Browse all your repositories</li>
            <li>🤖 AI-powered code review with Featherless</li>
            <li>💻 Terminal-style output</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
