# Chatbot UI Widget

A beautiful, animated, and highly customizable chatbot UI widget that can be integrated into any website with just a few lines of code. Compatible with OpenAI-style APIs and most LLM backends.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

- 🎨 **Multiple Themes**: Default, Dark, Ocean, and Sunset themes
- 🎙️ **Voice Input**: Built-in speech recognition support
- 🌊 **Streaming Support**: Real-time streaming responses
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ✨ **Beautiful Animations**: Smooth micro-interactions and transitions
- 🔌 **Easy Integration**: Copy-paste integration in minutes
- 🔐 **Authentication**: Bearer token and API key support
- 🌐 **Backend Agnostic**: Works with OpenAI, Anthropic, custom APIs
- 📊 **Rich Content Support**:
  - Markdown rendering with GFM support
  - Syntax highlighted code blocks
  - Charts (Chart.js integration)
  - Maps (Google Maps integration)
  - Tables with responsive design
  - HTML content rendering
  - JSON formatting

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Backend Integration](#backend-integration)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chatbot-ui.git
cd chatbot-ui

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
# Required: Your backend API endpoint
VITE_API_ENDPOINT=http://localhost:8000/v1/chat/completions

# Optional: Authentication (if your API requires it)
VITE_API_AUTH_TOKEN=your_bearer_token
VITE_API_KEY=your_api_key

# Optional: Additional features
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_ENABLE_ANALYTICS=false
```

### 3. Run Development Server

```bash
npm run dev
```

Your chatbot UI will be available at `http://localhost:5173`

## 🔗 Backend Integration

### Supported API Formats

#### OpenAI-Compatible APIs
```javascript
// Request format
POST /v1/chat/completions
{
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "stream": false  // or true for streaming
}

// Response format
{
  "choices": [{
    "message": {
      "role": "assistant", 
      "content": "Hello! How can I help you?"
    }
  }]
}
```

#### Custom API Format
```javascript
// Request format
POST /api/chat
{
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "include_sources": false
}

// Response format
{
  "content": "Hello! How can I help you?",
  "sources": []
}
```

### Backend Examples

#### Example 1: OpenAI API
```env
VITE_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_API_AUTH_TOKEN=sk-your-openai-key
```

#### Example 2: Anthropic Claude API
```env
VITE_API_ENDPOINT=https://api.anthropic.com/v1/messages
VITE_API_AUTH_TOKEN=sk-ant-your-anthropic-key
```

#### Example 3: Local LLM Server
```env
VITE_API_ENDPOINT=http://localhost:8000/v1/chat/completions
VITE_API_AUTH_TOKEN=your_local_token
```

#### Example 4: Custom Backend
```env
VITE_API_ENDPOINT=https://your-api.com/chat
VITE_API_KEY=your_custom_api_key
```

### Authentication Methods

The widget supports multiple authentication methods:

1. **Bearer Token** (recommended)
   ```env
   VITE_API_AUTH_TOKEN=your_bearer_token
   ```

2. **API Key Header**
   ```env
   VITE_API_KEY=your_api_key
   ```

3. **No Authentication**
   ```env
   # Leave both empty for public APIs
   ```

## ⚙️ Configuration

### Environment Variables Reference

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `VITE_API_ENDPOINT` | string | ✅ | Backend API endpoint | `http://localhost:8000/v1/chat/completions` |
| `VITE_API_AUTH_TOKEN` | string | ❌ | Bearer token for authentication | `sk-1234567890abcdef` |
| `VITE_API_KEY` | string | ❌ | API key (alternative to bearer token) | `your-api-key-here` |
| `VITE_GOOGLE_MAPS_API_KEY` | string | ❌ | Google Maps API key for map rendering | `AIzaSyB...` |
| `VITE_ENABLE_ANALYTICS` | boolean | ❌ | Enable analytics tracking | `true` or `false` |
| `VITE_ANALYTICS_ID` | string | ❌ | Analytics tracking ID | `G-XXXXXXXXXX` |
| `VITE_SENTRY_DSN` | string | ❌ | Sentry error tracking DSN | `https://...` |

### Widget Configuration Options

When integrating the widget into your website:

```javascript
ChatbotWidget.init({
  apiEndpoint: 'https://your-api.com/chat',    // Override env variable
  authToken: 'your-token',                     // Override env variable  
  theme: 'dark',                               // 'default' | 'dark' | 'ocean' | 'sunset'
  welcomeMessage: 'Hi! How can I help?',       // Welcome message
  enableVoiceInput: true,                      // Enable voice input
  streamingEnabled: true,                      // Enable streaming responses
  position: 'bottom-right',                    // 'bottom-right' | 'bottom-left'
  autoOpen: false,                             // Auto-open on page load
  maxMessageLength: 1000,                      // Max characters per message
  placeholder: 'Type your message...',         // Input placeholder
  
  // Custom styling
  primaryColor: '#3B82F6',                     // Primary color
  enableSounds: true,                          // Notification sounds
  
  // Advanced options
  debug: false,                                // Enable debug logging
  timeout: 30000,                              // Request timeout (ms)
  retryAttempts: 3                             // Number of retry attempts
});
```

### File-based Configuration

**File**: `/src/hooks/useConfig.js` - Default configuration
```javascript
const defaultConfig = {
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT || '/api/chat',
  theme: 'default',
  welcomeMessage: 'Hello! How can I help you today?',
  enableVoiceInput: true,
  streamingEnabled: true
}
```

## 🔧 Development

### Development Setup

1. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit with your settings
   nano .env
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test Different APIs**
   ```bash
   # Test with OpenAI
   VITE_API_ENDPOINT=https://api.openai.com/v1/chat/completions npm run dev
   
   # Test with local server
   VITE_API_ENDPOINT=http://localhost:8000/v1/chat/completions npm run dev
   ```

### Development URLs

- **Frontend**: http://localhost:5173
- **Demo Page**: http://localhost:5173/
- **Integration Example**: http://localhost:5173/integration-example.html

### Testing Backend Connection

```bash
# Test your API endpoint directly
curl -X POST "YOUR_API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "Hello test"}],
    "include_sources": false
  }'
```

## 🚀 Deployment

### Option 1: CDN Integration (Recommended)

1. **Build the widget**
   ```bash
   npm run build:widget
   ```

2. **Upload to CDN**
   Upload `dist/chatbot-widget.umd.js` to your CDN

3. **Integrate into your website**
   ```html
   <div id="chatbot-widget"></div>
   <script src="https://your-cdn.com/chatbot-widget.umd.js"></script>
   <script>
     ChatbotWidget.init({
       apiEndpoint: 'https://your-api.com/chat',
       authToken: 'your-production-token',
       theme: 'default'
     });
   </script>
   ```

### Option 2: Self-Hosted

1. **Build for production**
   ```bash
   # Create production environment file
   echo "VITE_API_ENDPOINT=https://your-api.com/chat" > .env.production
   echo "VITE_API_AUTH_TOKEN=your-production-token" >> .env.production
   
   # Build widget
   npm run build:widget
   ```

2. **Deploy files**
   ```bash
   # Copy to your web server
   scp dist/chatbot-widget.umd.js user@yourserver:/var/www/html/
   ```

3. **Integration**
   ```html
   <div id="chatbot-widget"></div>
   <script src="/chatbot-widget.umd.js"></script>
   <script>
     ChatbotWidget.init({
       theme: 'dark',
       welcomeMessage: 'Welcome to our support chat!'
     });
   </script>
   ```

### Environment-Specific Builds

```bash
# Development build
npm run build:widget

# Production build with specific environment
VITE_API_ENDPOINT=https://api.prod.com/chat npm run build:widget

# Staging build
VITE_API_ENDPOINT=https://api.staging.com/chat npm run build:widget
```

## 📡 API Documentation

### Request Format

The widget automatically handles different API formats:

#### For OpenAI-Compatible APIs
```typescript
interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  stream?: boolean;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}
```

#### For Custom APIs
```typescript
interface CustomChatRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  include_sources?: boolean;
  user_id?: string;
  session_id?: string;
}
```

### Response Handling

The widget automatically detects and handles:

1. **OpenAI Format**: `response.choices[0].message.content`
2. **Simple Format**: `response.content`
3. **Nested Format**: `response.message.content`
4. **Custom Format**: `response.data.content`

### Streaming Support

For streaming responses, send:
```
Content-Type: text/event-stream

data: {"choices":[{"delta":{"content":"Hello"}}]}
data: {"choices":[{"delta":{"content":" there!"}}]}
data: [DONE]
```

### Authentication Headers

The widget automatically adds authentication:

```javascript
// With VITE_API_AUTH_TOKEN
Authorization: Bearer your-token

// With VITE_API_KEY  
X-API-Key: your-api-key

// Custom authentication in init
ChatbotWidget.init({
  authToken: 'custom-token',
  customHeaders: {
    'X-Custom-Auth': 'custom-value'
  }
});
```

## 🎨 Content Rendering

### Markdown Support
```markdown
**Bold text**, *italic text*, `code`, and [links](https://example.com)

> Blockquotes are supported

- Bullet points
- Are also supported

1. Numbered lists
2. Work too
```

### Code Blocks with Syntax Highlighting
````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

```python
def greet(name):
    return f"Hello, {name}!"
```
````

### Charts
````markdown
```chart
{
  "type": "bar",
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "datasets": [{
      "label": "Revenue",
      "data": [10000, 15000, 12000, 18000],
      "backgroundColor": ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"]
    }]
  }
}
```
````

### Maps
````markdown
```map
{
  "center": { "lat": 37.7749, "lng": -122.4194 },
  "zoom": 12,
  "markers": [{
    "position": { "lat": 37.7749, "lng": -122.4194 },
    "title": "San Francisco Office"
  }]
}
```
````

### Tables
```markdown
| Feature | Status | Notes |
|---------|--------|-------|
| Markdown | ✅ | Full GFM support |
| Code | ✅ | Syntax highlighting |
| Charts | ✅ | Chart.js integration |
| Maps | ✅ | Google Maps |
```

## 🔧 Troubleshooting

### Common Issues

#### 1. API Connection Failed
```javascript
// Check browser console for:
// "HTTP error! status: 404" -> Wrong endpoint
// "CORS error" -> Backend CORS not configured
// "401 Unauthorized" -> Wrong/missing auth token

// Debug steps:
ChatbotWidget.init({
  apiEndpoint: 'your-endpoint',
  debug: true  // Enables detailed logging
});
```

#### 2. Authentication Issues
```bash
# Test your authentication
curl -X POST "YOUR_API_ENDPOINT" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages":[{"role":"user","content":"test"}]}'

# Common fixes:
# - Check token format (usually starts with sk-, claude-, etc.)
# - Verify token has chat permissions
# - Check token expiration
```

#### 3. Widget Not Appearing
```html
<!-- Ensure container exists -->
<div id="chatbot-widget"></div>

<!-- Ensure script loads after container -->
<script src="chatbot-widget.umd.js"></script>
<script>
  // Check if widget loaded
  if (typeof ChatbotWidget !== 'undefined') {
    ChatbotWidget.init({...});
  } else {
    console.error('ChatbotWidget not loaded');
  }
</script>
```

#### 4. Styling Issues
```css
/* If widget styling conflicts with your site */
#chatbot-widget {
  z-index: 9999 !important;
}

/* Reset conflicting styles */
#chatbot-widget * {
  box-sizing: border-box !important;
  margin: 0 !important;
}
```

### Debug Mode

Enable detailed logging:

```javascript
ChatbotWidget.init({
  debug: true,
  logLevel: 'verbose', // 'error' | 'warn' | 'info' | 'verbose'
  
  // Additional debug options
  showNetworkRequests: true,
  showStateChanges: true
});
```

### Browser DevTools

1. **Console**: Check for errors and debug logs
2. **Network**: Monitor API requests and responses
3. **Elements**: Inspect widget DOM structure
4. **Application**: Check localStorage/cookies

## 📁 Project Structure

```
chatbot-ui/
├── src/
│   ├── components/
│   │   ├── ChatbotWidget.jsx        # Main widget component
│   │   ├── ChatMessage.jsx          # Message rendering
│   │   └── renderers/               # Content renderers
│   │       ├── ChartRenderer.jsx    # Chart.js integration
│   │       ├── MapRenderer.jsx      # Google Maps integration
│   │       └── TableRenderer.jsx    # Table rendering
│   ├── hooks/
│   │   ├── useChat.js              # Chat logic & API calls
│   │   ├── useConfig.js            # Configuration management
│   │   └── useSpeechRecognition.js # Voice input
│   ├── widget/
│   │   └── index.jsx               # Widget entry point
│   └── utils/
│       └── cn.js                   # Utility functions
├── dist/                           # Build output (generated)
│   └── chatbot-widget.umd.js      # Production widget file
├── public/
│   ├── integration-example.html    # Integration examples
│   └── test.html                   # Testing page
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── .env.production                # Production environment
├── package.json                   # Dependencies & scripts
├── vite.config.js                # Development config
├── vite.widget.config.js         # Widget build config
└── README.md                     # This file
```

## 🌐 Browser Support

| Browser | Version | Voice Input | Streaming | Notes |
|---------|---------|-------------|-----------|-------|
| Chrome | 90+ | ✅ | ✅ | Full support |
| Firefox | 88+ | ❌ | ✅ | No voice input |
| Safari | 14+ | ⚠️ | ✅ | Limited voice support |
| Edge | 90+ | ✅ | ✅ | Full support |
| Mobile Chrome | Latest | ✅ | ✅ | Full support |
| Mobile Safari | Latest | ⚠️ | ✅ | Limited voice support |

## 📊 Performance

- **Bundle Size**: ~150KB gzipped
- **Load Time**: <500ms on average
- **Memory Usage**: <10MB typical
- **Lazy Loading**: Charts and maps loaded on demand

## 🔒 Security

1. **Content Security Policy**:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://your-cdn.com; 
               connect-src 'self' https://your-api.com;">
```

2. **API Security**:
   - Always use HTTPS in production
   - Implement rate limiting on your backend
   - Validate and sanitize all inputs
   - Use secure token storage

3. **XSS Prevention**:
   - All HTML content is sanitized by default
   - Markdown is safely rendered
   - Code blocks are properly escaped

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for utility-first styling
- Framer Motion for beautiful animations
- Chart.js for data visualization
- Google Maps for location services
- All contributors and users of this widget

---

For support or questions, please open an issue on GitHub or contact us at support@yourcompany.com
