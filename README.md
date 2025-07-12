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
- [Distribution Files](#distribution-files)
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

## 📦 Distribution Files

After running `npm run build:widget`, the following files are generated in the `dist/` folder:

### 🚀 **Generated Files**

| File | Size | Description |
|------|------|-------------|
| `chatbot-widget.umd.js` | ~1.3MB | Complete widget bundle with all functionality |
| `style.css` | ~15KB | Widget styles, themes, and animations |
| `integration-example.html` | - | Ready-to-use integration example |
| `test.html` | - | Test page for widget functionality |

### 📋 **File Details**

#### **chatbot-widget.umd.js**
- **Purpose**: Main widget file containing all React components and dependencies
- **Format**: UMD (Universal Module Definition) - works in browsers, Node.js, AMD
- **Contents**: 
  - React and React DOM
  - All chatbot components and hooks
  - Chart.js for chart rendering
  - Speech recognition functionality
  - Markdown parsing and syntax highlighting
- **Usage**: Include this file and call `ChatbotWidget.init()`

#### **style.css**
- **Purpose**: All widget styles and themes
- **Contents**:
  - Base component styles
  - Theme variations (default, dark, ocean, sunset)
  - Responsive design rules
  - Animation keyframes
- **Usage**: Link in HTML head or import in your build system

### 🔧 **Integration Methods**

#### **Method 1: Direct Integration**
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="./dist/style.css">
</head>
<body>
    <div id="chatbot-widget"></div>
    
    <script src="./dist/chatbot-widget.umd.js"></script>
    <script>
        ChatbotWidget.init({
            apiEndpoint: 'https://your-api.com/chat',
            authToken: 'your-token',
            theme: 'default',
            welcomeMessage: 'Hello! How can I help you?'
        });
    </script>
</body>
</html>
```

#### **Method 2: CDN Hosting**
1. **Upload files to your CDN**:
   ```bash
   # Upload to your CDN service
   aws s3 cp dist/chatbot-widget.umd.js s3://your-bucket/
   aws s3 cp dist/style.css s3://your-bucket/
   ```

2. **Reference from any website**:
   ```html
   <link rel="stylesheet" href="https://cdn.yoursite.com/style.css">
   <script src="https://cdn.yoursite.com/chatbot-widget.umd.js"></script>
   <script>
       ChatbotWidget.init({
           apiEndpoint: 'https://your-api.com/chat',
           authToken: 'your-production-token'
       });
   </script>
   ```

#### **Method 3: npm/Module Integration**
```bash
# Copy files to your project
cp dist/chatbot-widget.umd.js public/
cp dist/style.css public/

# Reference in your application
```

### 🎮 **Widget API Methods**

Once loaded, the widget exposes these methods:

```javascript
// Initialize the widget
ChatbotWidget.init({
    apiEndpoint: 'https://your-api.com/chat',
    authToken: 'your-token',
    theme: 'dark',
    // ... other options
});

// Control widget visibility
ChatbotWidget.open();
ChatbotWidget.close();

// Send messages programmatically
ChatbotWidget.sendMessage('Hello from external code!');

// Update configuration
ChatbotWidget.updateConfig({ 
    theme: 'ocean',
    welcomeMessage: 'Updated message!' 
});

// Destroy widget completely
ChatbotWidget.destroy();

// Event listeners
window.addEventListener('chatbot:opened', () => {
    console.log('Chatbot opened');
});

window.addEventListener('chatbot:closed', () => {
    console.log('Chatbot closed');
});

window.addEventListener('chatbot:message', (event) => {
    console.log('New message:', event.detail);
});
```

### 🧪 **Testing Built Files**

#### **Option 1: Local Test Server**
```bash
# Serve the dist folder
cd dist
python -m http.server 8080
# or
npx serve .

# Open in browser
open http://localhost:8080/test.html
```

#### **Option 2: Direct File Opening**
```bash
# Open test file directly
open dist/test.html

# Open integration example
open dist/integration-example.html
```

### 🔍 **File Validation**

Verify your build was successful:

```bash
# Check if files exist
ls -la dist/
# Should show: chatbot-widget.umd.js, style.css, test.html, integration-example.html

# Check file sizes
du -h dist/*
# chatbot-widget.umd.js should be ~1.3MB
# style.css should be ~15KB

# Test widget loads correctly
node -e "
const fs = require('fs');
const content = fs.readFileSync('dist/chatbot-widget.umd.js', 'utf8');
console.log('✅ Widget file contains ChatbotWidget:', content.includes('ChatbotWidget'));
"
```

### 📱 **Mobile Optimization**

The built widget is automatically optimized for mobile:

- **Responsive design**: Adapts to screen sizes
- **Touch-friendly**: Optimized tap targets
- **Performance**: Lazy loading of heavy components
- **Network-aware**: Handles poor connections gracefully

### 🔄 **Rebuilding**

To rebuild after changes:

```bash
# Clean previous build
rm -rf dist/

# Rebuild widget
npm run build:widget

# Verify new build
ls -la dist/
```

## 🚀 Deployment

### Option 1: CDN Integration (Recommended)

1. **Build the widget**
   ```bash
   npm run build:widget
   ```

2. **Upload both files to CDN**
   ```bash
   # Upload both required files
   dist/chatbot-widget.umd.js  # Main widget bundle
   dist/style.css             # Widget styles and themes
   ```

3. **Integrate into your website**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <!-- Include widget styles -->
       <link rel="stylesheet" href="https://your-cdn.com/style.css">
   </head>
   <body>
       <div id="chatbot-widget"></div>
       
       <!-- Include widget script -->
       <script src="https://your-cdn.com/chatbot-widget.umd.js"></script>
       <script>
         ChatbotWidget.init({
           apiEndpoint: 'https://your-api.com/chat',
           authToken: 'your-production-token',
           theme: 'default'
         });
       </script>
   </body>
   </html>
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
