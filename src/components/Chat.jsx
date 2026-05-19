import { useState, useRef, useEffect } from 'react';
import { parseAndExecuteCodeActions } from '../api/codeActions';
import styles from './Chat.module.css';

export default function Chat({ messages, onAddMessage, githubToken, selectedFile, selectedRepo }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        await sendMessage();
      }
    }
  };

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;

    // Add user message
    onAddMessage({
      id: Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    setInput('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_FEATHERLESS_API_URL || 'https://api.featherless.ai/v1/messages';
      const apiKey = import.meta.env.VITE_FEATHERLESS_API_KEY;

      console.log('🔍 Debug:');
      console.log('API URL:', apiUrl);
      console.log('API Key exists:', !!apiKey);
      console.log('API Key length:', apiKey?.length);

      if (!apiKey) {
        throw new Error('Featherless API key not configured');
      }

      // Build context message with instructions for code actions
      let contextMessage = userMessage;
      if (selectedFile) {
        contextMessage = `Context: Working with file "${selectedFile.name}" in repo "${selectedRepo?.name}"\n\n${userMessage}`;
      }

      // Add system prompt for code generation
      const systemPrompt = `You are CodI, an AI coding agent. Your ONLY job is to write code.

CRITICAL INSTRUCTIONS:
1. When user asks to create/write code, ALWAYS respond with JUST the code block
2. Use this format EXACTLY:
\`\`\`create:filename.ext
CODE HERE
\`\`\`

3. For updates:
\`\`\`update:filename.ext
CODE HERE
\`\`\`

4. NO PREAMBLE - Start with the code block immediately
5. Keep it SHORT - minimal explanation after code

Examples:
- "hello world" → \`\`\`create:hello.js\nconsole.log("Hello");\n\`\`\`
- "sum function" → \`\`\`create:sum.js\nfunction sum(a,b){return a+b;}\n\`\`\`

REMEMBER: Code block FIRST, no talking before it.`;

      contextMessage = systemPrompt + '\n\n' + contextMessage;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3-8b-chat-hf',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: contextMessage,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices?.[0]?.message?.content || data.content?.[0]?.text || 'No response';

      // Parse code actions from response
      const actions = await parseAndExecuteCodeActions(
        assistantMessage,
        githubToken,
        selectedRepo
      );

      // If there are auto-executable actions, execute them
      if (actions.length > 0) {
        console.log(`🤖 Found ${actions.length} code actions to execute`);
        try {
          for (const action of actions) {
            console.log(`Executing: ${action.type} ${action.filename}`);
            await action.execute();
          }
          // Add confirmation message
          const confirmMsg = actions
            .map((a) => `✅ ${a.type} ${a.filename}`)
            .join('\n');
          onAddMessage({
            id: Date.now() + 1.5,
            role: 'system',
            content: `Code actions executed:\n${confirmMsg}`,
            timestamp: new Date(),
          });
        } catch (actionError) {
          console.error('Action execution failed:', actionError);
          onAddMessage({
            id: Date.now() + 1.5,
            role: 'system',
            content: `⚠️ Action failed: ${actionError.message}`,
            timestamp: new Date(),
          });
        }
      }

      onAddMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      onAddMessage({
        id: Date.now() + 1,
        role: 'assistant',
        content: `⚠️ Error: ${error.message}`,
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3 className={styles.chatTitle}>CodI Assistant</h3>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>Start a conversation</p>
            <p className={styles.emptyText}>
              {selectedFile
                ? `Ask about ${selectedFile.name}`
                : 'Select a file to discuss'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${styles[msg.role]}`}
            >
              <div className={styles.messageBubble}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageBubble}>
              <span className={styles.typing}>
                <span></span><span></span><span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSendMessage}
          placeholder="Type your question... (Press Enter to send)"
          className={styles.input}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className={styles.sendButton}
        >
          {loading ? '...' : '↑'}
        </button>
      </div>
    </div>
  );
}
