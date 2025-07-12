import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Mock responses
const mockResponses = [
  "Hello! I'm your AI assistant. I can help you with various tasks and demonstrate different content rendering capabilities.",
  "I can render **markdown** content with *emphasis*, `code`, and [links](https://example.com).",
  "Here's a code example:\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```",
  "I can also display charts:\n```chart\n{\n  \"type\": \"line\",\n  \"data\": {\n    \"labels\": [\"Jan\", \"Feb\", \"Mar\", \"Apr\"],\n    \"datasets\": [{\n      \"label\": \"Revenue\",\n      \"data\": [30, 45, 60, 80],\n      \"borderColor\": \"#3B82F6\"\n    }]\n  }\n}\n```",
  "And even tables:\n\n| Feature | Status |\n|---------|--------|\n| Markdown | ✅ |\n| Code | ✅ |\n| Charts | ✅ |\n| Maps | ✅ |"
]

// Simple chat endpoint
app.post('/api/chat', (req, res) => {
  const { messages, stream } = req.body
  const lastMessage = messages[messages.length - 1]
  
  // Get a random response or echo based on content
  let response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
  
  // Special responses for certain keywords
  if (lastMessage.content.toLowerCase().includes('chart')) {
    response = "Here's a sample chart:\n```chart\n{\n  \"type\": \"bar\",\n  \"data\": {\n    \"labels\": [\"Q1\", \"Q2\", \"Q3\", \"Q4\"],\n    \"datasets\": [{\n      \"label\": \"Sales\",\n      \"data\": [150, 200, 180, 220],\n      \"backgroundColor\": [\"#3B82F6\", \"#8B5CF6\", \"#10B981\", \"#F59E0B\"]\n    }]\n  }\n}\n```"
  } else if (lastMessage.content.toLowerCase().includes('map')) {
    response = "Here's a map example:\n```map\n{\n  \"center\": { \"lat\": 40.7128, \"lng\": -74.0060 },\n  \"zoom\": 12,\n  \"markers\": [{\n    \"position\": { \"lat\": 40.7128, \"lng\": -74.0060 },\n    \"title\": \"New York City\"\n  }]\n}\n```\n\nNote: You'll need to provide a Google Maps API key for maps to work properly."
  }
  
  if (stream) {
    // Simulate streaming response
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    
    const words = response.split(' ')
    let index = 0
    
    const interval = setInterval(() => {
      if (index < words.length) {
        const content = words[index] + ' '
        res.write(`data: ${JSON.stringify({ content })}\n\n`)
        index++
      } else {
        res.write('data: [DONE]\n\n')
        clearInterval(interval)
        res.end()
      }
    }, 100)
  } else {    // Regular JSON response
    res.json({ content: response })
  }
})

app.listen(PORT, () => {
  console.log(`Mock chat server running on http://localhost:${PORT}`)
})
