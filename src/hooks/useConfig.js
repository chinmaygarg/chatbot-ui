import { useState, useEffect } from 'react'

const defaultConfig = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '/api/chat',
  theme: 'default',
  welcomeMessage: 'Hello! How can I help you today?',
  enableVoiceInput: true,
  streamingEnabled: true
}

export const useConfig = () => {
  const [config, setConfig] = useState(() => {
    // Get config from global window object if available
    if (typeof window !== 'undefined' && window.chatbotConfig) {
      return { ...defaultConfig, ...window.chatbotConfig }
    }
    return defaultConfig
  })

  const setTheme = (theme) => {
    setConfig(prev => ({ ...prev, theme }))
  }

  useEffect(() => {
    // Apply theme to root element
    const root = document.querySelector('[data-chatbot-theme]')
    if (root) {
      root.setAttribute('data-chatbot-theme', config.theme)
    }
  }, [config.theme])

  return { config, setConfig, setTheme }
}