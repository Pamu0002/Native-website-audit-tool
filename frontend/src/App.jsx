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

      // Extract probabilistic data
      const { confidences, modelDecision, uncertainties, suggestedActions, nextStep, modelReasoning } = response.data;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        
        // PROBABILISTIC DATA
        confidences: confidences || {},
        modelDecision,
        uncertainties: uncertainties || [],
        
        // Actions and recommendations
        suggestedActions: suggestedActions || [],
        nextStep,
        
        // Model's reasoning transparency
        modelReasoning
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
              
              {/* DISPLAY CONFIDENCE SCORES */}
              {msg.role === 'assistant' && msg.confidences && Object.keys(msg.confidences).length > 0 && (
                <div className="confidence-section">
                  <strong>📊 Model Confidence Scores:</strong>
                  <div className="confidence-list">
                    {Object.entries(msg.confidences).map(([key, conf], i) => (
                      <div key={i} className="confidence-item">
                        <span className="confidence-level">{conf.level}</span>
                        <span className="confidence-text">{conf.text?.substring(0, 80)}</span>
                        <span className="confidence-score">{(conf.score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* DISPLAY UNCERTAINTIES */}
              {msg.role === 'assistant' && msg.uncertainties && msg.uncertainties.length > 0 && (
                <div className="uncertainties-section">
                  <strong>❓ Model Uncertainties:</strong>
                  <ul className="uncertainties-list">
                    {msg.uncertainties.map((uncertainty, i) => (
                      <li key={i}>{uncertainty}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* DISPLAY MODEL DECISION */}
              {msg.role === 'assistant' && msg.modelDecision && (
                <div className="model-decision">
                  <strong>🎯 Model Decision:</strong>
                  <p>{msg.modelDecision}</p>
                </div>
              )}
              
              {/* DISPLAY SUGGESTED ACTIONS */}
              {msg.role === 'assistant' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="suggested-actions">
                  <strong>💡 Suggested Actions:</strong>
                  <ul>
                    {msg.suggestedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* DISPLAY NEXT STEP */}
              {msg.role === 'assistant' && msg.nextStep && (
                <div className="next-step">
                  <strong>➡️ Next Step: {msg.nextStep}</strong>
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
