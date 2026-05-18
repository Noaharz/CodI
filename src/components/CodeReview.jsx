import { useState } from 'react';
import { getRepoMainFiles } from '../api/github';
import { sendCodeReview } from '../api/featherless';
import TerminalOutput from './TerminalOutput';
import styles from './CodeReview.module.css';

export default function CodeReview({ repo, githubToken }) {
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewing, setReviewing] = useState(null);

  const handleReview = async () => {
    if (!repo) return;

    try {
      setLoading(true);
      setError(null);
      setOutput([]);

      const lines = [
        `code-review$ reviewing ${repo.name}...`,
        `fetching repository files...`,
      ];
      setOutput(lines);

      const files = await getRepoMainFiles(githubToken, repo.owner.login, repo.name);

      if (files.length === 0) {
        setOutput([...lines, 'error: no source files found']);
        return;
      }

      setOutput([
        ...lines,
        `✓ found ${files.length} files to review`,
        '',
      ]);

      for (const file of files) {
        setOutput(prev => [...prev, `analyzing ${file.name}...`]);
        setReviewing(file.name);

        try {
          const review = await sendCodeReview(file.content, file.name);

          setOutput(prev => [
            ...prev,
            ``,
            `=== Code Review: ${file.name} ===`,
            review,
            '',
          ]);
        } catch (fileError) {
          setOutput(prev => [...prev, `error reviewing ${file.name}: ${fileError.message}`]);
        }
      }

      setOutput(prev => [...prev, `✓ review complete`]);
    } catch (err) {
      setError(err.message);
      setOutput(prev => [...prev, `error: ${err.message}`]);
    } finally {
      setLoading(false);
      setReviewing(null);
    }
  };

  if (!repo) {
    return (
      <div className={styles.empty}>
        <p>Select a repository to start reviewing</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.repoInfo}>
        <h2>{repo.name}</h2>
        <p>{repo.description || 'No description'}</p>
        <div className={styles.meta}>
          <span>{repo.private ? '🔒 Private' : '🌐 Public'}</span>
          <span>⭐ {repo.stargazers_count} stars</span>
          {repo.language && <span>💻 {repo.language}</span>}
        </div>
      </div>

      <button
        onClick={handleReview}
        disabled={loading}
        className={styles.reviewButton}
      >
        {loading ? `Reviewing ${reviewing}...` : '🚀 Start Code Review'}
      </button>

      {error && <div className={styles.error}>{error}</div>}

      <TerminalOutput output={output} loading={loading && reviewing === null} />
    </div>
  );
}
