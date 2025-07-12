# Troubleshooting Guide

## Common Issues and Solutions

### Installation Issues

#### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Node version mismatch
```bash
# Check your Node version
node --version

# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node 18
nvm install 18
nvm use 18
```

### Runtime Issues

#### 1. CORS Errors

**Error**: `Access to fetch at 'http://localhost:3001/api/chat' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution**:
```javascript
// In your backend (Express example)
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  credentials: true
}));
```

#### 2. WebSocket Connection Failed

**Error**: `WebSocket connection to 'ws://localhost:3001' failed`

**Solution**:
- Ensure your backend supports WebSocket/SSE
- Check firewall settings
- Use HTTPS/WSS in production

#### 3. Voice Input Not Working

**Checklist**:
- ✓ Using Chrome or Edge browser
- ✓ HTTPS enabled (required for production)
- ✓ Microphone permissions granted
- ✓ No other app using microphone

#### 4. Maps Not Loading

**Error**: `Google Maps JavaScript API error: InvalidKeyMapError`

**Solution**:
```javascript
// Set API key before initializing
window.GOOGLE_MAPS_API_KEY = 'your-api-key';

// Or in config
ChatbotWidget.init({
  googleMapsApiKey: 'your-api-key'
});
```

### Performance Issues

#### Slow Initial Load
```javascript
// Enable production build
npm run build:widget

// Enable gzip compression
// nginx.conf
gzip on;
gzip_types text/javascript application/javascript;
```

#### Memory Leaks
```javascript
// Check for event listener cleanup
useEffect(() => {
  const handler = () => {};
  window.addEventListener('event', handler);
  
  return () => {
    window.removeEventListener('event', handler);
  };
}, []);
```

### Styling Issues

#### Styles Not Applied
```css
/* Increase specificity */
#chatbot-widget [data-chatbot-theme] .your-class {
  /* your styles */
}

/* Or use important */
.chatbot-message {
  color: red !important;
}
```

#### Theme Not Changing
```javascript
// Force theme update
ChatbotWidget.updateConfig({ theme: 'dark' });

// Check localStorage
localStorage.removeItem('chatbot-theme');
```

### Mobile Issues

#### Keyboard Covers Input
```css
/* Add viewport adjustments */
.chatbot-input-container {
  position: fixed;
  bottom: env(safe-area-inset-bottom);
}
```

#### Touch Events Not Working
```javascript
// Use pointer events
element.addEventListener('pointerdown', handler);
// Instead of
element.addEventListener('mousedown', handler);
```

## Debug Commands

### Enable Verbose Logging
```javascript
// In browser console
localStorage.setItem('chatbot-debug', 'true');
window.location.reload();
```

### Check Widget Status
```javascript
// In browser console
console.log(window.ChatbotWidget);
console.log(document.querySelector('#chatbot-widget'));
```

### Monitor Network Requests
```javascript
// Add request interceptor
window.ChatbotWidget.interceptors = {
  request: (config) => {
    console.log('Request:', config);
    return config;
  },
  response: (response) => {
    console.log('Response:', response);
    return response;
  }
};
```

## Getting Help

1. Check the [FAQ](./FAQ.md)
2. Search [existing issues](https://github.com/yourusername/chatbot-ui/issues)
3. Join our [Discord community](https://discord.gg/chatbot-ui)
4. Contact support: support@yourcompany.com