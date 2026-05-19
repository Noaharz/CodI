const GITHUB_API_URL = 'https://api.github.com';

export async function fetchUserRepos(githubToken) {
  try {
    const response = await fetch(`${GITHUB_API_URL}/user/repos?per_page=100`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repos:', error);
    throw error;
  }
}

export async function getRepoContents(githubToken, owner, repo, path = '') {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents${path ? `/${path}` : ''}`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    // Empty repo returns 404 - handle gracefully
    if (response.status === 404 && !path) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching repo contents:', error);
    throw error;
  }
}

export async function getFileContent(githubToken, owner, repo, path) {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw error;
  }
}

export async function commitFile(githubToken, owner, repo, path, content, message) {
  try {
    // Get current file SHA for update
    const currentFile = await getRepoContents(githubToken, owner, repo, path);
    const currentSha = Array.isArray(currentFile) ? null : currentFile.sha;

    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          message: message || `Update ${path}`,
          content: btoa(content), // Base64 encode
          sha: currentSha,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub API error: ${error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error committing file:', error);
    throw error;
  }
}

export async function getRepoMainFiles(githubToken, owner, repo) {
  try {
    const contents = await getRepoContents(githubToken, owner, repo);
    const mainFiles = [];

    for (const item of contents) {
      if (item.type === 'file' &&
          (item.name.endsWith('.js') ||
           item.name.endsWith('.jsx') ||
           item.name.endsWith('.ts') ||
           item.name.endsWith('.tsx') ||
           item.name === 'README.md')) {
        const content = await getFileContent(githubToken, owner, repo, item.path);
        mainFiles.push({
          path: item.path,
          name: item.name,
          content: content,
          size: item.size
        });

        if (mainFiles.length >= 5) break;
      }
    }

    return mainFiles;
  } catch (error) {
    console.error('Error getting main files:', error);
    throw error;
  }
}
