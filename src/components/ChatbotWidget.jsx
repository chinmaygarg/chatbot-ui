import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Mic, MicOff, Maximize2, Minimize2, Moon, Sun, Palette } from 'lucide-react'
import ChatMessage from './ChatMessage'
import { cn } from '../utils/cn'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useChat } from '../hooks/useChat'
import { useConfig } from '../hooks/useConfig'

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const { config, setTheme } = useConfig()
  const { messages, sendMessage, isStreaming } = useChat(config.apiEndpoint)
  const { isListening, startListening, stopListening, transcript } = useSpeechRecognition()

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript)
    }
  }, [transcript])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Event listeners for programmatic control
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    const handleSendMessage = (e) => {
      if (e.detail?.message) {
        setInputValue(e.detail.message)
        // Trigger submit after a small delay to ensure input is updated
        setTimeout(() => {
          const form = document.querySelector('form')
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true }))
          }
        }, 100)
      }
    }

    window.addEventListener('chatbot:open', handleOpen)
    window.addEventListener('chatbot:close', handleClose)
    window.addEventListener('chatbot:sendMessage', handleSendMessage)

    return () => {
      window.removeEventListener('chatbot:open', handleOpen)
      window.removeEventListener('chatbot:close', handleClose)
      window.removeEventListener('chatbot:sendMessage', handleSendMessage)
    }
  }, [])

  const scrollToBottom = () => {    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isStreaming) return
    
    const message = inputValue.trim()
    setInputValue('')
    await sendMessage(message)
  }

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const themes = ['default', 'dark', 'ocean', 'sunset']
  const nextTheme = () => {
    const currentIndex = themes.indexOf(config.theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-chatbot-primary text-white rounded-full shadow-lg flex items-center justify-center z-50"
          >
            <MessageCircle size={24} />
            <div className="absolute -inset-1">
              <div className="w-full h-full rounded-full bg-chatbot-primary opacity-20 animate-wave" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed z-50 bg-chatbot-background rounded-2xl shadow-2xl flex flex-col",
              isExpanded 
                ? "inset-4 md:inset-8" 
                : "bottom-6 right-6 w-[calc(100vw-3rem)] md:w-96 h-[calc(100vh-6rem)] md:h-[600px] max-h-[600px]"
            )}
            data-chatbot-theme={config.theme}          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-chatbot-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chatbot-primary to-chatbot-secondary flex items-center justify-center">
                  <MessageCircle size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-chatbot-text">Assistant</h3>
                  <p className="text-xs text-chatbot-text-secondary">
                    {isStreaming ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextTheme}
                  className="p-2 hover:bg-chatbot-hover rounded-lg transition-colors"
                  title="Change theme"
                >
                  <Palette size={18} className="text-chatbot-text-secondary" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-chatbot-hover rounded-lg transition-colors"
                >                  {isExpanded ? (
                    <Minimize2 size={18} className="text-chatbot-text-secondary" />
                  ) : (
                    <Maximize2 size={18} className="text-chatbot-text-secondary" />
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-chatbot-hover rounded-lg transition-colors"
                >
                  <X size={18} className="text-chatbot-text-secondary" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-scrollbar">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-chatbot-text-secondary mt-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-chatbot-primary/20 to-chatbot-secondary/20 flex items-center justify-center">
                    <MessageCircle size={32} className="text-chatbot-primary" />
                  </div>
                  <p className="text-lg font-medium mb-2">Welcome!</p>                  <p className="text-sm">{config.welcomeMessage}</p>
                </motion.div>
              )}
              
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  message={message} 
                  isStreaming={isStreaming && index === messages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-chatbot-border">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-chatbot-surface text-chatbot-text rounded-xl border border-chatbot-border focus:outline-none focus:ring-2 focus:ring-chatbot-primary/50 transition-all"
                    disabled={isStreaming}
                  />
                </div>
                
                <motion.button                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVoiceInput}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    isListening 
                      ? "bg-red-500 text-white animate-pulse-subtle" 
                      : "bg-chatbot-surface hover:bg-chatbot-hover text-chatbot-text"
                  )}
                  disabled={isStreaming}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </motion.button>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputValue.trim() || isStreaming}
                  className={cn(
                    "p-3 rounded-xl transition-all",
                    inputValue.trim() && !isStreaming
                      ? "bg-chatbot-primary text-white hover:bg-chatbot-primary/90"
                      : "bg-chatbot-surface text-chatbot-text-secondary cursor-not-allowed"
                  )}
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </form>          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatbotWidget