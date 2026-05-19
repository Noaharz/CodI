import { useState } from 'react';
import FileExplorer from './FileExplorer';
import CodeEditor from './CodeEditor';
import styles from './CodePanel.module.css';

export default function CodePanel({ repo, githubToken, selectedFile, onSelectFile }) {
  const [showFiles, setShowFiles] = useState(true);

  return (
    <div className={styles.codePanel}>
      <div className={styles.toggleBar}>
        <button
          className={`${styles.toggleBtn} ${showFiles ? styles.active : ''}`}
          onClick={() => setShowFiles(true)}
        >
          📁 Files
        </button>
        <button
          className={`${styles.toggleBtn} ${!showFiles ? styles.active : ''}`}
          onClick={() => setShowFiles(false)}
        >
          ≡ Code
        </button>
      </div>

      <div className={styles.content}>
        {showFiles && (
          <FileExplorer
            repo={repo}
            githubToken={githubToken}
            onSelectFile={onSelectFile}
          />
        )}
        {!showFiles && (
          <CodeEditor file={selectedFile} repo={repo} githubToken={githubToken} />
        )}
      </div>
    </div>
  );
}
