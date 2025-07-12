import React from 'react'
import ReactDOM from 'react-dom/client'
import ChatbotWidget from '../components/ChatbotWidget'
import '../index.css'

// Global initialization function
window.ChatbotWidget = {
  init: function(config = {}) {
    // Store config globally
    window.chatbotConfig = config
    
    // Create container if it doesn't exist
    let container = document.getElementById('chatbot-widget')
    if (!container) {
      container = document.createElement('div')
      container.id = 'chatbot-widget'
      document.body.appendChild(container)
    }
    
    // Render the widget
    const root = ReactDOM.createRoot(container)
    root.render(
      <React.StrictMode>
        <ChatbotWidget />
      </React.StrictMode>
    )
  },
  
  // Utility method to update config
  updateConfig: function(newConfig) {
    window.chatbotConfig = { ...window.chatbotConfig, ...newConfig }
    // Re-render with new config    this.init(window.chatbotConfig)
  },
  
  // Method to programmatically open the chat
  open: function() {
    const event = new CustomEvent('chatbot:open')
    window.dispatchEvent(event)
  },
  
  // Method to programmatically close the chat
  close: function() {
    const event = new CustomEvent('chatbot:close')
    window.dispatchEvent(event)
  },
  
  // Method to send a message programmatically
  sendMessage: function(message) {
    const event = new CustomEvent('chatbot:sendMessage', { detail: { message } })
    window.dispatchEvent(event)
  }
}

// Auto-initialize if config is provided
if (window.chatbotConfig) {
  window.ChatbotWidget.init(window.chatbotConfig)
}