import React, { useState, useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { MessageSquare, X, Send, Loader2, Code, List, ExternalLink, MessageCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Chatbot = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with system message, which won't be displayed
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are NeuroGen AI assistant. User is currently using NeuroGen AI platform. Always respond in structured JSON.' },
    { role: 'assistant', content: { type: 'text', content: 'Hello! I am NeuroGen AI assistant. I can help you explore our AI tools, guide you through the platform, or answer any questions about our features. What would you like to do?' } }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isSignedIn) {
    return null; // Only visible to logged-in users
  }

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send system message + last 5 messages to maintain memory context without huge token usage
      const systemMessage = updatedMessages[0];
      const recentMessages = updatedMessages.slice(1).slice(-5);
      const payloadMessages = [systemMessage, ...recentMessages];

      const { data } = await axios.post('/api/ai/chat', { messages: payloadMessages }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        toast.error(data.message || 'Failed to get a response');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (msgContent) => {
    // Backward compatibility for string messages
    if (typeof msgContent === 'string') {
      return (
        <div className="prose prose-sm max-w-none prose-invert text-inherit">
          <ReactMarkdown>{msgContent}</ReactMarkdown>
        </div>
      );
    }

    const { type, content, title, points, code, language, action } = msgContent;

    switch (type) {
      case 'list':
        return (
          <div className="flex flex-col gap-2">
            {title && <p className="font-semibold text-sm">{title}</p>}
            {content && (
              <div className="text-sm">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
            <ul className="list-disc list-inside flex flex-col gap-1 mt-1">
              {points?.map((point, i) => (
                <li key={i} className="text-sm">{point}</li>
              ))}
            </ul>
          </div>
        );
      case 'code':
        return (
          <div className="flex flex-col gap-2 w-full max-w-full overflow-hidden">
            {title && <p className="font-semibold text-sm">{title}</p>}
            {content && <p className="text-sm">{content}</p>}
            <div className="relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Code className="w-4 h-4 text-gray-400" />
              </div>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-xs font-mono border border-gray-700">
                <code className={`language-${language || 'javascript'}`}>
                  {code}
                </code>
              </pre>
            </div>
          </div>
        );
      case 'card':
        return (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 p-4 rounded-xl shadow-sm">
            {title && <h4 className="font-bold text-purple-900 mb-1 flex items-center gap-2"><List className="w-4 h-4" /> {title}</h4>}
            <div className="text-sm text-gray-700">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            {points && points.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {points.map((p, i) => <span key={i} className="px-2 py-0.5 bg-white border border-purple-200 text-[10px] rounded-full text-purple-600">{p}</span>)}
              </div>
            )}
          </div>
        );
      case 'action':
        return (
          <div className="flex flex-col gap-3">
          <div className="text-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
            <button
              onClick={() => action?.target && navigate(action.target)}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              {action?.label || 'Click Here'}
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        );
      case 'text':
      default:
        return (
          <div className="flex flex-col gap-1">
            {title && <p className="font-semibold text-sm">{title}</p>}
            <div className="prose prose-sm max-w-none text-inherit">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: '550px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">NeuroGen AI</h3>
                  <p className="text-[10px] text-purple-100 mt-1 opacity-80">Online & Ready to Help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 scrollbar-hide">
              {messages.filter(m => m.role !== 'system').map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={index}
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none self-end'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none self-start'
                  }`}
                >
                  {renderMessageContent(msg.content)}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 text-gray-500 p-3 rounded-2xl rounded-bl-none self-start shadow-sm max-w-[80%] flex items-center gap-3"
                >
                  <div className="flex gap-1">
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                  </div>
                  <span className="text-xs font-medium">NeuroGen is thinking...</span>
                </motion.div>
              )}
              {messages.length <= 2 && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-2 px-1">
                  {[
                    "How to use this site?",
                    "What tools are available?",
                    "Generate an image",
                    "Review my resume"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(suggestion);
                        // Small delay to allow state update if needed, but handleSend can take input
                      }}
                      className="text-[11px] bg-purple-50 text-purple-600 border border-purple-100 py-1.5 px-3 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSend} className="flex items-center gap-2 bg-gray-100 rounded-2xl p-1 px-2 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-purple-100">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 p-2 px-2 bg-transparent rounded-full text-sm outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center w-10 h-10 shadow-md hover:shadow-lg active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
