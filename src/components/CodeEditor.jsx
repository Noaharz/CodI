import { useState, useEffect } from 'react';
import { getFileContent } from '../api/github';
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
    if (!modified || !file) return;

    setSaving(true);
    try {
      // TODO: Implement GitHub commit API
      // Will commit changes with message based on context
      console.log('Saving file:', file.path);
      console.log('Content length:', content.length);

      // Placeholder - actual commit implementation coming
      alert('File save with auto-commit coming soon!');
      setModified(false);
    } catch (err) {
      setError(err.message);
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
