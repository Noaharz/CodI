import { useState, useEffect } from 'react';
import { getFileContent, commitFile } from '../api/github';
import styles from './CodeEditor.module.css';

// Simple syntax highlighting - we'll use Highlight.js pattern
const getLanguageFromFile = (filename) => {
  const ext = filename.split('.').pop();
  const langMap = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    sql: 'sql',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    md: 'markdown',
    txt: 'plaintext',
  };
  return langMap[ext] || 'plaintext';
};

export default function CodeEditor({ file, repo, githubToken }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modified, setModified] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (file) {
      loadFile();
    }
  }, [file]);

  // Ctrl+S / Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (modified) handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modified, file, content]);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFileContent(
        githubToken,
        repo.owner.login,
        repo.name,
        file.path
      );
      setContent(data);
      setModified(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!modified || !file || !repo) return;

    setSaving(true);
    setError(null);
    try {
      await commitFile(
        githubToken,
        repo.owner.login,
        repo.name,
        file.path,
        content,
        `Update ${file.name}`
      );
      setModified(false);
      // Optional: Show success toast
      console.log('✅ File saved to GitHub:', file.path);
    } catch (err) {
      setError(err.message);
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const language = file ? getLanguageFromFile(file.name) : 'plaintext';
  const lineCount = content.split('\n').length;

  return (
    <div className={styles.codeEditor}>
      {file && (
        <>
          <div className={styles.header}>
            <div className={styles.fileInfo}>
              <span className={styles.fileName}>{file.path}</span>
              <span className={styles.language}>{language}</span>
              <span className={styles.lineCount}>{lineCount} lines</span>
            </div>
            <div className={styles.actions}>
              {modified && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={styles.saveBtn}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              Error: {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : (
            <div className={styles.editorWrapper}>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setModified(true);
                }}
                className={styles.editorInput}
                spellCheck="false"
              />
              <pre className={styles.editorPre}>
                <code className={`language-${language}`}>{content}</code>
              </pre>
            </div>
          )}
        </>
      )}

      {!file && (
        <div className={styles.empty}>
          <p>Select a file to view code</p>
        </div>
      )}
    </div>
  );
}
