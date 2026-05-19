import { useState, useEffect } from 'react';
import { getRepoContents } from '../api/github';
import styles from './FileExplorer.module.css';

const IGNORE_DIRS = ['node_modules', '.git', '.github', 'dist', 'build', '.next', '.nuxt', '.cache'];

export default function FileExplorer({ repo, githubToken, onSelectFile }) {
  const [tree, setTree] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repo) {
      loadRepoStructure();
    }
  }, [repo]);

  const loadRepoStructure = async () => {
    setLoading(true);
    try {
      const contents = await getRepoContents(
        githubToken,
        repo.owner.login,
        repo.name,
        ''
      );
      setTree(contents.filter((item) => !IGNORE_DIRS.includes(item.name)));
    } catch (error) {
      console.error('Failed to load repo structure:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (path) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const getFileIcon = (type, name) => {
    if (type === 'dir') return '📁';
    const ext = name.split('.').pop();
    const icons = {
      js: '⚙️',
      jsx: '⚛️',
      ts: '📘',
      tsx: '⚛️',
      py: '🐍',
      json: '📋',
      md: '📄',
      html: '🌐',
      css: '🎨',
      scss: '🎨',
      go: '🐹',
      rs: '🦀',
      java: '☕',
      rb: '💎',
      php: '🐘',
    };
    return icons[ext] || '📄';
  };

  const FileItem = ({ item, depth = 0 }) => {
    const isDir = item.type === 'dir';
    const isExpanded = expanded.has(item.path);

    return (
      <div key={item.path}>
        <div
          className={styles.fileItem}
          style={{ paddingLeft: `${depth * 16}px` }}
          onClick={() => {
            if (isDir) {
              toggleFolder(item.path);
            } else {
              onSelectFile(item);
            }
          }}
        >
          <span className={styles.icon}>
            {isDir ? (
              <span className={styles.expandIcon}>
                {isExpanded ? '▼' : '▶'}
              </span>
            ) : null}
          </span>
          <span className={styles.fileIcon}>{getFileIcon(item.type, item.name)}</span>
          <span className={styles.fileName}>{item.name}</span>
        </div>

        {isDir && isExpanded && item.children && (
          <div>
            {item.children
              .filter((child) => !IGNORE_DIRS.includes(child.name))
              .map((child) => (
                <FileItem key={child.path} item={child} depth={depth + 1} />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.fileExplorer}>
      <div className={styles.header}>
        <h4 className={styles.title}>Files</h4>
        <button onClick={loadRepoStructure} className={styles.refreshBtn} title="Refresh">
          ↻
        </button>
      </div>

      <div className={styles.fileList}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : tree.length > 0 ? (
          tree.map((item) => <FileItem key={item.path} item={item} />)
        ) : (
          <div className={styles.empty}>No files</div>
        )}
      </div>
    </div>
  );
}
