import { useState, useCallback } from 'react'

export const useChat = (apiEndpoint) => {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (content) => {
    // Add user message
    const userMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)

    // Add empty assistant message for streaming
    const assistantMessage = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    try {
      // Get auth token from environment variables
      const authToken = import.meta.env.VITE_API_AUTH_TOKEN

      const headers = {
        'Content-Type': 'application/json',
      }

      // Add authorization header if token is available
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [...messages, userMessage],
          include_sources: false
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Check if response is streaming (SSE)
      if (response.headers.get('content-type')?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                // Handle different possible response formats
                const content = parsed.choices?.[0]?.delta?.content || 
                              parsed.content || 
                              parsed.message?.content || ''
                
                if (content) {
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]
                    if (lastMessage.role === 'assistant') {
                      lastMessage.content += content
                    }
                    return newMessages
                  })
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e, 'Data:', data)
              }
            }
          }
        }
      } else {
        // Handle regular JSON response
        const data = await response.json()
        
        // Handle different possible response formats
        const content = data.choices?.[0]?.message?.content || 
                       data.content || 
                       data.message?.content || 
                       data.response || 
                       'Sorry, I could not process that request.'
        
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.role === 'assistant') {
            lastMessage.content = content
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.content = 'Sorry, I encountered an error. Please try again.'
        }
        return newMessages
      })
    } finally {
      setIsStreaming(false)
    }
  }, [apiEndpoint, messages])

  return { messages, sendMessage, isStreaming }
}
