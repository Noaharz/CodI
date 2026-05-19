import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [githubToken, setGithubToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('github_token');
    const storedUser = localStorage.getItem('github_user');

    if (storedToken && storedUser) {
      setGithubToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGithub = async () => {
    try {
      setError(null);
      setLoading(true);

      // Call Vercel API function
      const response = await fetch('/api/auth-github');

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error);
      }

      const { token } = await response.json();

      // Get user info from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info from GitHub');
      }

      const userData = await userResponse.json();

      // Store in localStorage and state
      localStorage.setItem('github_token', token);
      localStorage.setItem('github_user', JSON.stringify(userData));

      setGithubToken(token);
      setUser(userData);
    } catch (err) {
      setError(err.message);
      console.error('GitHub sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      localStorage.removeItem('github_token');
      localStorage.removeItem('github_user');
      setUser(null);
      setGithubToken(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      githubToken,
      loading,
      error,
      signInWithGithub,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
