import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, ChevronDown } from 'lucide-react';
import './ChatWidget.css';

const QUICK_CHIPS = [
  '💸 Cheapest Netflix plan?',
  '📺 Sabse sasta OTT plan?',
  '🎮 Gaming seat prices?',
  '🛒 How do I buy? (Kaise kharidein?)',
  '📱 Kaunse devices support karte hain?',
];

const WELCOME = {
  role: 'bot',
  content: "Hey! I'm **StreamBot** 🤖\n\nI can help you find the best subscription plan, check prices, or answer any questions.\n(Main Hindi aur English dono mein baat kar sakta hoon!)\n\nWhat are you looking for today? / Aaj aap kya dhoondh rahe hain?",
  id: 0,
};

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #a855f7; text-decoration: underline;">$1</a>')
    .replace(/\n/g, '<br/>');
}

export default function ChatWidget() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [unread, setUnread]     = useState(0);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const getHistory = () =>
    messages.slice(1).map(m => ({ role: m.role, content: m.content }));

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');

    // Strip raw image-filename references so the API never receives them as chat content
    const sanitized = trimmed.replace(/([A-Za-z]:?[\\\/][^\s\\\/]+|(Screenshot\s+\d{4}-\d{2}-\d{2}\s+\d{6}))\.(png|jpg|jpeg|gif|webp|bmp|svg)/gi, '[image]');

    const userMsg = { role: 'user', content: sanitized, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: sanitized, history: getHistory() }),
      });
      const data = await res.json();
      const botMsg = { role: 'bot', content: data.reply || 'Sorry, something went wrong!', id: Date.now() + 1 };
      setMessages(prev => [...prev, botMsg]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Connection error. Please try again or contact us on Telegram!', id: Date.now() + 1 }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* ── CHAT PANEL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="bot-avatar">
                  <Bot size={18} />
                  <span className="bot-status-dot" />
                </div>
                <div>
                  <div className="chat-title">StreamBot</div>
                  <div className="chat-subtitle">AI Support · Usually replies instantly</div>
                </div>
              </div>
              <button className="chat-close" onClick={() => setOpen(false)}>
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chat-bubble-wrap ${msg.role}`}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                >
                  {msg.role === 'bot' && (
                    <div className="bubble-avatar"><Bot size={13} /></div>
                  )}
                  <div
                    className="chat-bubble"
                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                  />
                </motion.div>
              ))}

              {/* Quick chips — shown only after welcome msg */}
              {messages.length === 1 && (
                <motion.div
                  className="quick-chips"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {QUICK_CHIPS.map((chip) => (
                    <motion.button
                      key={chip}
                      className="quick-chip"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage(chip)}
                    >
                      {chip}
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  className="chat-bubble-wrap bot"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bubble-avatar"><Bot size={13} /></div>
                  <div className="chat-bubble typing-bubble">
                    <span className="dot" /><span className="dot" /><span className="dot" />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="chat-input-wrap">
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Ask about any plan or price..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <motion.button
                className={`chat-send ${input.trim() ? 'active' : ''}`}
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                whileHover={input.trim() ? { scale: 1.1 } : {}}
                whileTap={input.trim() ? { scale: 0.9 } : {}}
              >
                <Send size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB BUTTON ─────────────────────────────────────────── */}
      <motion.button
        className="chat-fab"
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={open ? {} : { y: [0, -6, 0] }}
        transition={open ? {} : { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 2 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && unread > 0 && (
          <motion.span
            className="chat-badge"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {unread}
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
