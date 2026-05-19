import { commitFile, getFileContent } from './github';

// Parse AI response for code creation commands
export async function parseAndExecuteCodeActions(response, githubToken, repo) {
  const actions = [];

  // Pattern: ```create:filename.ext
  // code here
  // ```
  // More flexible: capture filename and code, handle various whitespace
  const createPattern = /```create:([^\n`]+?)(?:\n|\s)([\s\S]*?)```/g;
  let match;

  while ((match = createPattern.exec(response)) !== null) {
    let filename = match[1].trim();
    let code = match[2].trim();

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
  const updatePattern = /```update:([^\n`]+?)(?:\n|\s)([\s\S]*?)```/g;
  while ((match = updatePattern.exec(response)) !== null) {
    let filename = match[1].trim();
    let code = match[2].trim();

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

  console.log(`✅ Parsed ${actions.length} code actions`);
  if (actions.length > 0) {
    actions.forEach(a => console.log(`  - ${a.type}: ${a.filename}`));
  }

  return actions;
}
