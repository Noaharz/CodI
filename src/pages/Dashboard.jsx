import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Chat from '../components/Chat';
import CodePanel from '../components/CodePanel';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, githubToken, signOut } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !githubToken) {
      navigate('/login');
    }
  }, [user, githubToken, navigate]);

  const handleAddMessage = (message) => {
    setChatMessages([...chatMessages, message]);
  };

  return (
    <div className={styles.container}>
      <Header
        user={user}
        selectedRepo={selectedRepo}
        onSelectRepo={setSelectedRepo}
        onLogout={() => {
          signOut();
          navigate('/login');
        }}
        githubToken={githubToken}
      />

      <div className={styles.mainContent}>
        <div className={styles.chatSidebar}>
          <Chat
            messages={chatMessages}
            onAddMessage={handleAddMessage}
            githubToken={githubToken}
            selectedFile={selectedFile}
            selectedRepo={selectedRepo}
          />
        </div>

        <div className={styles.codePanel}>
          {selectedRepo ? (
            <CodePanel
              repo={selectedRepo}
              githubToken={githubToken}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>Select a repository to start coding</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
