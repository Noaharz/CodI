import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './AuthCallback.module.css';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>Authenticating...</h2>
        <div className={styles.spinner}></div>
        <p>Please wait while we verify your GitHub account</p>
      </div>
    </div>
  );
}
