# Chatbot UI - Quick Reference

## 🚀 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/chatbot-ui.git
cd chatbot-ui
npm install
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit with your API details
nano .env
```

### 3. Set Your API Endpoint
```env
# For OpenAI
VITE_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_API_AUTH_TOKEN=sk-your-openai-key

# For Local LLM
VITE_API_ENDPOINT=http://localhost:8000/v1/chat/completions
VITE_API_AUTH_TOKEN=your-local-token

# For Custom API
VITE_API_ENDPOINT=https://your-api.com/chat
VITE_API_AUTH_TOKEN=your-token
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:5173 🎉

## 📦 Production Deployment

### Build Widget
```bash
npm run build:widget
```

### Integrate into Website
```html
<div id="chatbot-widget"></div>
<script src="https://your-cdn.com/chatbot-widget.umd.js"></script>
<script>
  ChatbotWidget.init({
    apiEndpoint: 'https://your-api.com/chat',
    authToken: 'your-production-token',
    theme: 'dark'
  });
</script>
```

## 🔧 Common Configurations

### OpenAI API
```env
VITE_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_API_AUTH_TOKEN=sk-proj-1234567890abcdef
```

### Anthropic Claude
```env
VITE_API_ENDPOINT=https://api.anthropic.com/v1/messages
VITE_API_AUTH_TOKEN=sk-ant-1234567890abcdef
```

### Local Ollama
```env
VITE_API_ENDPOINT=http://localhost:11434/v1/chat/completions
VITE_API_AUTH_TOKEN=ollama
```

### Custom Backend
```env
VITE_API_ENDPOINT=https://your-api.com/chat
VITE_API_AUTH_TOKEN=your-bearer-token
```

## 🎨 Widget Options

```javascript
ChatbotWidget.init({
  // Required
  apiEndpoint: 'https://your-api.com/chat',
  
  // Authentication
  authToken: 'your-token',
  
  // Appearance  
  theme: 'dark',                    // default, dark, ocean, sunset
  primaryColor: '#3B82F6',
  position: 'bottom-right',         // bottom-right, bottom-left
  
  // Behavior
  welcomeMessage: 'Hi! How can I help?',
  autoOpen: false,
  enableVoiceInput: true,
  streamingEnabled: true,
  
  // Limits
  maxMessageLength: 1000,
  timeout: 30000,
  
  // Debug
  debug: false
});
```

## 📊 Content Rendering

### Charts
````markdown
```chart
{
  "type": "bar",
  "data": {
    "labels": ["Q1", "Q2", "Q3"],
    "datasets": [{
      "label": "Sales",
      "data": [100, 150, 120]
    }]
  }
}
```
````

### Maps
````markdown
```map
{
  "center": {"lat": 37.7749, "lng": -122.4194},
  "zoom": 12,
  "markers": [{
    "position": {"lat": 37.7749, "lng": -122.4194},
    "title": "Location"
  }]
}
```
````

### Code
````markdown
```javascript
function hello() {
  console.log("Hello World!");
}
```
````

### Tables
```markdown
| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Charts | ✅ |
| Maps | ✅ |
```

## 🐛 Troubleshooting

### Widget Not Appearing
```html
<!-- Check container exists -->
<div id="chatbot-widget"></div>

<!-- Check script loaded -->
<script>
console.log(typeof ChatbotWidget); // Should not be 'undefined'
</script>
```

### API Connection Issues
```bash
# Test your API directly
curl -X POST "YOUR_API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"messages":[{"role":"user","content":"test"}]}'
```

### Debug Mode
```javascript
ChatbotWidget.init({
  debug: true,  // Enable detailed logging
  // ... other options
});
```

### Common Fixes
- **CORS Error**: Configure backend to allow your domain
- **401 Unauthorized**: Check API token format and permissions  
- **404 Not Found**: Verify API endpoint URL
- **Widget Styling**: Add `z-index: 9999 !important` to widget container

## 📱 Mobile Responsive

The widget automatically adapts to mobile devices:
- Touch-friendly interface
- Responsive layout
- Optimized animations
- Voice input support (where available)

## 🔒 Security Checklist

- [ ] Use HTTPS in production
- [ ] Secure API token storage
- [ ] Implement rate limiting
- [ ] Validate user inputs
- [ ] Configure CSP headers
- [ ] Regular security audits

## 📚 Full Documentation

For complete documentation, see [README.md](README.md)

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/chatbot-ui/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/chatbot-ui/discussions)
- **Email**: support@yourcompany.com

---

⭐ Star this repository if it helped you!
