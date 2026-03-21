import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import './App.css';

export function App() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize conversation
  useEffect(() => {
    startConversation();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    try {
      const response = await axios.post('/api/chat/start', {
        userId: `user-${Date.now()}`
      });

      setConversationId(response.data.conversationId);
      setMessages([
        {
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !urlInput.trim()) return;

    const userMessage = input.trim();
    const url = urlInput.trim();

    // Add user message to UI
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage + (url ? ` (URL: ${url})` : ''),
      timestamp: new Date()
    }]);

    setInput('');
    setUrlInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        conversationId,
        message: userMessage,
        url: url || undefined
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        suggestedActions: response.data.suggestedActions,
        nextStep: response.data.nextStep
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error: ${error.response?.data?.error || error.message}`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 AI Website Audit Assistant</h1>
        <p>Chat with AI to analyze websites intelligently</p>
      </header>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="suggested-actions">
                  <strong>💡 Suggested next steps:</strong>
                  <ul>
                    {msg.suggestedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              {msg.nextStep && (
                <div className="next-step">
                  <strong>➡️ Want to: {msg.nextStep}</strong>
                </div>
              )}
            </div>
            <span className="timestamp">
              {msg.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content loading">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="url-input">
          <input
            type="url"
            placeholder="https://example.com (optional)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="message-input">
          <textarea
            placeholder="Ask me to audit a website, ask questions, or request improvements..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="2"
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || (!input.trim() && !urlInput.trim())}
            className="send-btn"
          >
            {loading ? '⏳ Analyzing...' : '📤 Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
