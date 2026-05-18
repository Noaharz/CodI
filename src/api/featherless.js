export async function sendCodeReview(code, fileName) {
  const apiUrl = import.meta.env.VITE_FEATHERLESS_API_URL;
  const apiKey = import.meta.env.VITE_FEATHERLESS_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('Featherless API credentials not configured');
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-opus',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Please review the following code from file "${fileName}". Provide a detailed code review including:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance considerations
4. Suggestions for improvement
5. Security concerns if any

Code to review:
\`\`\`
${code}
\`\`\``
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Featherless API error: ${response.statusText} - ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || 'No review generated';
  } catch (error) {
    console.error('Error sending code review:', error);
    throw error;
  }
}
