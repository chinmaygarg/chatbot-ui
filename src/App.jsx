import React from 'react'
import ChatbotWidget from './components/ChatbotWidget'

function App() {
  const demoMessages = [
    "Hello! Show me what you can do.",
    "Can you show me a chart?",
    "What about code highlighting?",
    "Can you render a table?"
  ]

  const sendDemoMessage = (message) => {
    window.ChatbotWidget.sendMessage(message)
    window.ChatbotWidget.open()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Chatbot UI Demo
        </h1>
        <p className="text-gray-600 mb-8">
          This page demonstrates the chatbot widget. The chatbot is in the bottom right corner.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Example</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
              <code>{`<!-- Add this to your HTML -->
<div id="chatbot-widget"></div>
<script src="https://your-domain.com/chatbot-widget.umd.js"></script>
<script>
  ChatbotWidget.init({
    apiEndpoint: 'https://your-api.com/chat',
    theme: 'default',
    welcomeMessage: 'Hello! How can I help you today?'
  });
</script>`}</code>
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Try Demo Messages</h2>
            <div className="space-y-2">
              {demoMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => sendDemoMessage(message)}
                  className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                >
                  "{message}"
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✨ Beautiful animations and micro-interactions</li>
              <li>🎨 Multiple themes (Default, Dark, Ocean, Sunset)</li>
              <li>🎙️ Voice input support</li>
              <li>🌊 Streaming responses</li>
              <li>📱 Mobile responsive</li>
              <li>📊 Chart.js integration</li>
              <li>🗺️ Google Maps support</li>
              <li>💻 Syntax highlighted code blocks</li>
              <li>📝 Markdown rendering</li>
              <li>📋 Table support</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Content Examples</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-1">Charts</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`\`\`\`chart
{
  "type": "bar",
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "datasets": [{
      "label": "Sales",
      "data": [150, 200, 180, 220]
    }]
  }
}
\`\`\``}
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Maps</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
{`\`\`\`map
{
  "center": {"lat": 37.7749, "lng": -122.4194},
  "zoom": 12,
  "markers": [{
    "position": {"lat": 37.7749, "lng": -122.4194},
    "title": "San Francisco"
  }]
}
\`\`\``}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ChatbotWidget />    </div>
  )
}

export default App