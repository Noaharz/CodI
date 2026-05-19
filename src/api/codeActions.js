import { commitFile, getFileContent } from './github';

// Parse AI response for code creation commands
export async function parseAndExecuteCodeActions(response, githubToken, repo) {
  const actions = [];

  // Pattern: ```create:filename.ext
  // code here
  // ```
  const createPattern = /```create:([^\s]+)\n([\s\S]*?)\n```/g;
  let match;

  while ((match = createPattern.exec(response)) !== null) {
    const filename = match[1];
    const code = match[2];

    actions.push({
      type: 'create',
      filename,
      code,
      execute: async () => {
        const result = await commitFile(
          githubToken,
          repo.owner.login,
          repo.name,
          filename,
          code,
          `Add ${filename} - created by CodI`
        );
        return result;
      },
    });
  }

  // Pattern: ```update:filename.ext
  // code here
  // ```
  const updatePattern = /```update:([^\s]+)\n([\s\S]*?)\n```/g;
  while ((match = updatePattern.exec(response)) !== null) {
    const filename = match[1];
    const code = match[2];

    actions.push({
      type: 'update',
      filename,
      code,
      execute: async () => {
        const result = await commitFile(
          githubToken,
          repo.owner.login,
          repo.name,
          filename,
          code,
          `Update ${filename} - modified by CodI`
        );
        return result;
      },
    });
  }

  return actions;
}
