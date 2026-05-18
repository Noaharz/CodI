import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RepoList from '../components/RepoList';
import CodeReview from '../components/CodeReview';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, githubToken, signOut } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const navigate = useNavigate();

  if (!user || !githubToken) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>💻 Code Reviewer</h1>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>
            <img src={user.user_metadata?.avatar_url} alt={user.email} className={styles.avatar} />
            <span>{user.user_metadata?.name || user.email}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.main}>
        <div className={styles.sidebar}>
          <RepoList
            githubToken={githubToken}
            onSelectRepo={setSelectedRepo}
          />
        </div>
        <div className={styles.content}>
          <CodeReview
            repo={selectedRepo}
            githubToken={githubToken}
          />
        </div>
      </div>
    </div>
  );
}
