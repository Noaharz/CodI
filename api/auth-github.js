import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Versuche gh auth token zu holen
    const { stdout, stderr } = await execAsync('gh auth token');

    if (stderr && !stdout) {
      return res.status(401).json({
        error: 'Not authenticated',
        message: 'Please run `gh auth login` in your terminal first'
      });
    }

    const token = stdout.trim();
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error getting gh token:', error);
    return res.status(500).json({
      error: 'Failed to get GitHub token',
      message: error.message,
      hint: 'Make sure `gh` CLI is installed and run `gh auth login` in your terminal'
    });
  }
}
