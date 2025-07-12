# API Reference

## ChatbotWidget Global Object

The `ChatbotWidget` object is available globally after loading the script.

### Methods

#### `init(config)`
Initializes the chatbot widget with the specified configuration.

```javascript
ChatbotWidget.init({
  apiEndpoint: 'https://api.example.com/chat',
  theme: 'dark',
  welcomeMessage: 'Hello! How can I help you?',
  position: 'bottom-right',
  autoOpen: false
});
```

**Parameters:**
- `config` (Object): Configuration object with the following properties:
  - `apiEndpoint` (String): URL of your chat API endpoint
  - `theme` (String): Theme name ('default', 'dark', 'ocean', 'sunset')
  - `welcomeMessage` (String): Initial message shown to users
  - `position` (String): Widget position ('bottom-right', 'bottom-left')
  - `autoOpen` (Boolean): Automatically open chat on load
  - `enableVoiceInput` (Boolean): Enable voice input feature
  - `streamingEnabled` (Boolean): Enable streaming responses
  - `googleMapsApiKey` (String): Google Maps API key for map rendering
  - `debug` (Boolean): Enable debug mode
  - `onMessage` (Function): Callback for new messages
  - `onOpen` (Function): Callback when chat opens
  - `onClose` (Function): Callback when chat closes

#### `open()`
Opens the chat widget programmatically.

```javascript
ChatbotWidget.open();
```

#### `close()`
Closes the chat widget programmatically.

```javascript
ChatbotWidget.close();
```

#### `toggle()`
Toggles the chat widget open/closed state.

```javascript
ChatbotWidget.toggle();
```

#### `sendMessage(message)`
Sends a message programmatically.

```javascript
ChatbotWidget.sendMessage('Hello, I need help!');
```

**Parameters:**
- `message` (String): The message to send

#### `updateConfig(config)`
Updates the widget configuration dynamically.

```javascript
ChatbotWidget.updateConfig({
  theme: 'ocean',
  welcomeMessage: 'New welcome message!'
});
```

**Parameters:**
- `config` (Object): Partial configuration object to update

#### `destroy()`
Removes the widget from the page and cleans up resources.

```javascript
ChatbotWidget.destroy();
```

#### `getState()`
Returns the current state of the widget.

```javascript
const state = ChatbotWidget.getState();
console.log(state);
// {
//   isOpen: true,
//   theme: 'dark',
//   messages: [...],
//   isStreaming: false
// }
```

#### `clearMessages()`
Clears all messages from the chat.

```javascript
ChatbotWidget.clearMessages();
```

### Events

The widget emits custom events that you can listen to:

#### `chatbot:opened`
Fired when the chat widget is opened.

```javascript
window.addEventListener('chatbot:opened', (event) => {
  console.log('Chat opened');
});
```

#### `chatbot:closed`
Fired when the chat widget is closed.

```javascript
window.addEventListener('chatbot:closed', (event) => {
  console.log('Chat closed');
});
```

#### `chatbot:message`
Fired when a new message is sent or received.

```javascript
window.addEventListener('chatbot:message', (event) => {
  console.log('New message:', event.detail);
  // {
  //   role: 'user' | 'assistant',
  //   content: 'message content',
  //   timestamp: Date
  // }
});
```

#### `chatbot:error`
Fired when an error occurs.

```javascript
window.addEventListener('chatbot:error', (event) => {
  console.error('Chat error:', event.detail);
});
```

#### `chatbot:theme-changed`
Fired when the theme is changed.

```javascript
window.addEventListener('chatbot:theme-changed', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});
```

## Backend API Specification

### Chat Endpoint

#### Request

```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant", 
      "content": "Hi! How can I help you?"
    }
  ],
  "stream": true,
  "userId": "optional-user-id",
  "sessionId": "optional-session-id",
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

#### Response (Streaming)

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"content": "Hello", "type": "text"}

data: {"content": "! How can ", "type": "text"}

data: {"content": "I help you today?", "type": "text"}

data: [DONE]
```

#### Response (Non-Streaming)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "content": "Hello! How can I help you today?",
  "type": "text",
  "metadata": {
    "processingTime": 1234,
    "model": "gpt-4"
  }
}
```

### Special Content Types

#### Chart Response
```json
{
  "content": "```chart\n{\"type\":\"bar\",\"data\":{...}}\n```",
  "type": "text"
}
```

#### Map Response
```json
{
  "content": "```map\n{\"center\":{\"lat\":37.7749,\"lng\":-122.4194}}\n```",
  "type": "text"
}
```

#### Error Response
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

## Content Rendering

### Markdown
Standard markdown with GitHub Flavored Markdown (GFM) support.

### Code Blocks
Use triple backticks with language identifier:
- `javascript`, `python`, `java`, etc. for syntax highlighting
- `chart` or `chart.js` for Chart.js rendering
- `map` or `maps` for Google Maps rendering

### Charts
```markdown
\`\`\`chart
{
  "type": "line|bar|pie|doughnut|radar|polarArea",
  "data": {
    "labels": ["Label1", "Label2"],
    "datasets": [{
      "label": "Dataset 1",
      "data": [10, 20],
      "backgroundColor": ["#FF6384", "#36A2EB"]
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Chart Title"
      }
    }
  }
}
\`\`\`
```

### Maps
```markdown
\`\`\`map
{
  "center": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "zoom": 12,
  "markers": [{
    "position": {
      "lat": 37.7749,
      "lng": -122.4194
    },
    "title": "Marker Title",
    "info": "Info window content"
  }],
  "options": {
    "mapTypeId": "roadmap|satellite|hybrid|terrain",
    "disableDefaultUI": false,
    "zoomControl": true
  }
}
\`\`\`
```

## TypeScript Definitions

```typescript
interface ChatbotConfig {
  apiEndpoint: string;
  theme?: 'default' | 'dark' | 'ocean' | 'sunset';
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
  autoOpen?: boolean;
  enableVoiceInput?: boolean;
  streamingEnabled?: boolean;
  googleMapsApiKey?: string;
  debug?: boolean;
  onMessage?: (message: Message) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface ChatbotWidget {
  init(config: ChatbotConfig): void;
  open(): void;
  close(): void;
  toggle(): void;
  sendMessage(message: string): void;
  updateConfig(config: Partial<ChatbotConfig>): void;
  destroy(): void;
  getState(): ChatbotState;
  clearMessages(): void;
}

interface ChatbotState {
  isOpen: boolean;
  theme: string;
  messages: Message[];
  isStreaming: boolean;
}
```