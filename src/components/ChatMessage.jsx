import React from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { User, Bot, Copy, Check } from 'lucide-react'
import { cn } from '../utils/cn'
import ChartRenderer from './renderers/ChartRenderer'
import MapRenderer from './renderers/MapRenderer'
import TableRenderer from './renderers/TableRenderer'

const ChatMessage = ({ message, isStreaming }) => {
  const [copiedCode, setCopiedCode] = React.useState(null)
  
  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(index)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''
      
      if (!inline && match) {
        const codeString = String(children).replace(/\n$/, '')
        const codeIndex = Math.random()
        
        // Check for special render types
        if (language === 'chart' || language === 'chart.js') {
          try {
            const chartConfig = JSON.parse(codeString)
            return <ChartRenderer config={chartConfig} />
          } catch (e) {
            console.error('Invalid chart config:', e)
          }
        }
        
        if (language === 'map' || language === 'maps') {
          try {
            const mapConfig = JSON.parse(codeString)
            return <MapRenderer config={mapConfig} />
          } catch (e) {
            console.error('Invalid map config:', e)
          }
        }
        
        return (
          <div className="relative group">
            <button
              onClick={() => copyToClipboard(codeString, codeIndex)}
              className="absolute right-2 top-2 p-2 rounded-md bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedCode === codeIndex ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <SyntaxHighlighter
              language={language}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.875rem'
              }}
              {...props}
            >
              {codeString}
            </SyntaxHighlighter>
          </div>
        )
      }
      
      return (
        <code className="bg-chatbot-surface px-1.5 py-0.5 rounded text-sm text-chatbot-text" {...props}>
          {children}
        </code>
      )
    },
    table: TableRenderer,
    p({ children, ...props }) {
      // Check if content is HTML
      if (typeof children === 'string' && children.includes('<') && children.includes('>')) {
        return <div dangerouslySetInnerHTML={{ __html: children }} />
      }
      return <p {...props}>{children}</p>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        message.role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {message.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chatbot-primary to-chatbot-secondary flex items-center justify-center flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        message.role === 'user' 
          ? "bg-chatbot-primary text-white" 
          : "bg-chatbot-surface text-chatbot-text"
      )}>
        <div className="chatbot-content">
          {message.role === 'user' ? (
            <p>{message.content}</p>
          ) : (
            <>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {message.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
              )}
            </>
          )}
        </div>
      </div>
      
      {message.role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-chatbot-text-secondary flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  )
}

export default ChatMessage