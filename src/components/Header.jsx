import { useState, useEffect } from 'react';
import { fetchUserRepos } from '../api/github';
import styles from './Header.module.css';

export default function Header({ user, selectedRepo, onSelectRepo, onLogout, githubToken }) {
  const [repos, setRepos] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (githubToken && !repos.length) {
      loadRepos();
    }
  }, [githubToken]);

  const loadRepos = async () => {
    setLoading(true);
    try {
      const data = await fetchUserRepos(githubToken);
      setRepos(data);
    } catch (error) {
      console.error('Failed to load repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRepo = (repo) => {
    onSelectRepo(repo);
    setShowDropdown(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>💻</span>
          <span className={styles.logoText}>CodI</span>
        </div>

        <div className={styles.repoSelector}>
          <button
            className={styles.selectorButton}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className={styles.repoName}>
              {selectedRepo?.name || 'Select Repository'}
            </span>
            <span className={styles.chevron}>▼</span>
          </button>

          {showDropdown && (
            <div className={styles.dropdown}>
              {loading ? (
                <div className={styles.dropdownItem}>Loading...</div>
              ) : repos.length > 0 ? (
                repos.map((repo) => (
                  <button
                    key={repo.id}
                    className={`${styles.dropdownItem} ${
                      selectedRepo?.id === repo.id ? styles.active : ''
                    }`}
                    onClick={() => handleSelectRepo(repo)}
                  >
                    <span className={styles.itemName}>{repo.name}</span>
                    <span className={styles.itemMeta}>
                      {repo.private ? '🔒' : '🌐'}
                    </span>
                  </button>
                ))
              ) : (
                <div className={styles.dropdownItem}>No repositories found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.userProfile}>
          <img src={user?.avatar_url} alt={user?.login} className={styles.avatar} />
          <span className={styles.username}>{user?.login}</span>
        </div>

        <button onClick={onLogout} className={styles.logoutButton}>
          Sign out
        </button>
      </div>
    </header>
  );
}
