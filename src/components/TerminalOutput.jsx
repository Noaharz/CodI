import { useEffect, useRef } from 'react';
import styles from './TerminalOutput.module.css';

export default function TerminalOutput({ output, loading }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <div className={styles.title}>code-review@ai ~ $</div>
        <div className={styles.buttons}>
          <div className={styles.button + ' ' + styles.close}></div>
        </div>
      </div>

      <div className={styles.content} ref={terminalRef}>
        {output.map((line, idx) => (
          <div key={idx} className={styles.line}>
            <span className={styles.prompt}>$</span>
            <span className={styles.text}>{line}</span>
          </div>
        ))}

        {loading && (
          <div className={styles.line}>
            <span className={styles.prompt}>$</span>
            <span className={styles.text + ' ' + styles.blinking}>
              Analyzing code...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
