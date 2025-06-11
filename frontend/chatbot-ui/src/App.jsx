// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!conversationId) {
      setConversationId(Date.now().toString());
    }
  }, [conversationId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = { sender: 'user', text: message, timestamp: new Date() };
    setChatHistory((prev) => [...prev, userMessage]);

    // Clear message and refocus input immediately
    setMessage('');
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    try {
      const res = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.text, // Use the original message since we cleared it
          conversation_id: conversationId,
        }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();

      const botReply = { sender: 'ai', text: data.response, timestamp: new Date() };
      setChatHistory((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('API error:', err);
      setChatHistory((prev) => [
        ...prev,
        { sender: 'ai', text: 'I apologize, but I encountered an error. Please try again.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
      // Ensure focus returns to input after loading is complete
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const WelcomeMessage = () => (
    <div className="welcome-container">
      <div className="welcome-icon">
        <svg viewBox="0 0 24 24" fill="currentColor" className="sparkles-icon">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/>
        </svg>
      </div>
      <h2 className="welcome-title">Welcome to AI Assistant</h2>
      <p className="welcome-subtitle">How can I help you today?</p>
      <div className="suggestion-grid">
        {[
          "Ask me anything",
          "Get creative ideas", 
          "Solve problems",
          "Learn something new"
        ].map((suggestion, i) => (
          <button
            key={i}
            onClick={() => setMessage(suggestion)}
            className="suggestion-button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <div className="chat-wrapper">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
              </svg>
            </div>
            <div className="header-text">
              <h1 className="header-title">AI Assistant</h1>
              <p className="header-subtitle">Always here to help</p>
            </div>
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span className="status-text">Online</span>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div ref={chatContainerRef} className="chat-container">
          {chatHistory.length === 0 ? (
            <WelcomeMessage />
          ) : (
            chatHistory.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                <div className="message-content">
                  <div className={`avatar ${msg.sender === 'user' ? 'user-avatar' : 'ai-avatar'}`}>
                    {msg.sender === 'user' ? (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    )}
                  </div>
                  <div className="message-group">
                    <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                      <p className="message-text">{msg.text}</p>
                    </div>
                    <div className={`message-time ${msg.sender === 'user' ? 'user-time' : 'ai-time'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="message-wrapper ai-message">
              <div className="message-content">
                <div className="avatar ai-avatar">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </div>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-container">
          <form onSubmit={sendMessage} className="input-form">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="message-input"
                placeholder="Type your message..."
                disabled={loading}
                maxLength={500}
              />
              <div className="character-count">{message.length}/500</div>
            </div>
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="send-button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="send-icon">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;