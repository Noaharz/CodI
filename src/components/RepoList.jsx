import { useEffect, useState } from 'react';
import { fetchUserRepos } from '../api/github';
import styles from './RepoList.module.css';

export default function RepoList({ githubToken, onSelectRepo }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrivate, setFilterPrivate] = useState(null);

  useEffect(() => {
    const loadRepos = async () => {
      try {
        setLoading(true);
        setError(null);
        const repoList = await fetchUserRepos(githubToken);
        setRepos(repoList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (githubToken) {
      loadRepos();
    }
  }, [githubToken]);

  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPrivate === null || repo.private === filterPrivate;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Your Repositories</h2>
        <p className={styles.count}>{repos.length} repos</p>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.search}
        />
        <div className={styles.filters}>
          <button
            className={filterPrivate === null ? styles.active : ''}
            onClick={() => setFilterPrivate(null)}
          >
            All
          </button>
          <button
            className={filterPrivate === false ? styles.active : ''}
            onClick={() => setFilterPrivate(false)}
          >
            Public
          </button>
          <button
            className={filterPrivate === true ? styles.active : ''}
            onClick={() => setFilterPrivate(true)}
          >
            Private
          </button>
        </div>
      </div>

      {loading && <div className={styles.loading}>Loading repositories...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      <div className={styles.repoList}>
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className={styles.repoItem}
            onClick={() => onSelectRepo(repo)}
          >
            <div className={styles.repoName}>{repo.name}</div>
            <div className={styles.repoMeta}>
              <span className={repo.private ? styles.private : styles.public}>
                {repo.private ? '🔒 Private' : '🌐 Public'}
              </span>
              {repo.language && (
                <span className={styles.language}>{repo.language}</span>
              )}
              <span className={styles.stars}>⭐ {repo.stargazers_count}</span>
            </div>
            {repo.description && (
              <p className={styles.description}>{repo.description}</p>
            )}
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && !loading && (
        <div className={styles.empty}>No repositories found</div>
      )}
    </div>
  );
}
