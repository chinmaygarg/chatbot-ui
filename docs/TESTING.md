# Testing Guide

## Overview

This guide covers all aspects of testing the chatbot widget, including unit tests, integration tests, E2E tests, and manual testing procedures.

## Test Structure

```
tests/
├── unit/           # Component and utility tests
├── integration/    # API and feature integration tests
├── e2e/           # End-to-end browser tests
├── fixtures/      # Test data and mocks
└── utils/         # Test helpers and utilities
```

## Unit Testing

### Setup

```bash
# Install testing dependencies
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest \
  jest-environment-jsdom
```

### Configuration

Create `jest.config.js`:
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-env'
      ]
    }]
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/widget/index.jsx'
  ]
};
```

### Example Tests

#### Component Test
```javascript
// tests/unit/ChatMessage.test.js
import { render, screen } from '@testing-library/react';
import ChatMessage from '@/components/ChatMessage';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    const message = {
      role: 'user',
      content: 'Hello, chatbot!'
    };
    
    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('Hello, chatbot!')).toBeInTheDocument();
    expect(screen.getByText('Hello, chatbot!').closest('div'))
      .toHaveClass('bg-chatbot-primary');
  });

  it('renders markdown content', () => {
    const message = {
      role: 'assistant',
      content: '**Bold** and *italic* text'
    };
    
    render(<ChatMessage message={message} />);
    
    const boldElement = screen.getByText('Bold');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('handles code blocks correctly', () => {
    const message = {
      role: 'assistant',
      content: '```javascript\nconst x = 1;\n```'
    };
    
    render(<ChatMessage message={message} />);
    
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });
});
```

#### Hook Test
```javascript
// tests/unit/useChat.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';

// Mock fetch
global.fetch = jest.fn();

describe('useChat', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('sends message and updates state', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ content: 'Hello!' }),
      headers: new Headers({ 'content-type': 'application/json' })
    });

    const { result } = renderHook(() => useChat('/api/chat'));

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].content).toBe('Hi');
    expect(result.current.messages[1].content).toBe('Hello!');
  });

  it('handles streaming responses', async () => {
    const mockReader = {
      read: jest.fn()
        .mockResolvedValueOnce({ 
          value: new TextEncoder().encode('data: {"content":"Hello"}\n\n'),
          done: false 
        })
        .mockResolvedValueOnce({ 
          value: new TextEncoder().encode('data: {"content":" World"}\n\n'),
          done: false 
        })
        .mockResolvedValueOnce({ done: true })
    };

    fetch.mockResolvedValueOnce({
      headers: new Headers({ 'content-type': 'text/event-stream' }),
      body: { getReader: () => mockReader }
    });

    const { result } = renderHook(() => useChat('/api/chat'));

    await act(async () => {
      await result.current.sendMessage('Hi');
    });

    await waitFor(() => {
      expect(result.current.messages[1].content).toBe('Hello World');
    });
  });
});
```

### Run Unit Tests

```bash
# Run all unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- ChatMessage.test.js
```

## Integration Testing

### API Integration Tests

```javascript
// tests/integration/api.test.js
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { renderHook, waitFor } from '@testing-library/react';
import { useChat } from '@/hooks/useChat';

const server = setupServer(
  rest.post('/api/chat', (req, res, ctx) => {
    return res(
      ctx.json({ content: 'Mocked response' })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration', () => {
  it('handles successful API calls', async () => {
    const { result } = renderHook(() => useChat('/api/chat'));

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(result.current.messages[1].content).toBe('Mocked response');
    });
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.post('/api/chat', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useChat('/api/chat'));

    await act(async () => {
      await result.current.sendMessage('Test');
    });

    await waitFor(() => {
      expect(result.current.messages[1].content)
        .toContain('Sorry, I encountered an error');
    });
  });
});
```

## E2E Testing

### Playwright Setup

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install
```

### Playwright Configuration

Create `playwright.config.js`:
```javascript
export default {
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
};
```

### E2E Test Examples

```javascript
// tests/e2e/chatbot.spec.js
import { test, expect } from '@playwright/test';

test.describe('Chatbot Widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open and close chat', async ({ page }) => {
    // Click chat bubble
    await page.click('[aria-label="Open chat"]');
    
    // Check if chat window is visible
    await expect(page.locator('.chatbot-window')).toBeVisible();
    
    // Close chat
    await page.click('[aria-label="Close chat"]');
    
    // Check if chat window is hidden
    await expect(page.locator('.chatbot-window')).not.toBeVisible();
  });

  test('should send and receive messages', async ({ page }) => {
    // Open chat
    await page.click('[aria-label="Open chat"]');
    
    // Type message
    await page.fill('input[placeholder="Type your message..."]', 'Hello');
    
    // Send message
    await page.click('[aria-label="Send message"]');
    
    // Check if message appears
    await expect(page.locator('text=Hello').first()).toBeVisible();
    
    // Wait for response
    await expect(page.locator('.assistant-message')).toBeVisible();
  });

  test('should change themes', async ({ page }) => {
    // Open chat
    await page.click('[aria-label="Open chat"]');
    
    // Click theme button
    await page.click('[aria-label="Change theme"]');
    
    // Check if theme changed
    const chatWindow = page.locator('.chatbot-window');
    await expect(chatWindow).toHaveAttribute('data-chatbot-theme', 'dark');
  });

  test('should handle voice input', async ({ page, browserName }) => {
    // Skip for non-Chromium browsers
    test.skip(browserName !== 'chromium', 'Voice input only in Chrome');
    
    // Grant microphone permission
    await page.context().grantPermissions(['microphone']);
    
    // Open chat
    await page.click('[aria-label="Open chat"]');
    
    // Click voice button
    await page.click('[aria-label="Voice input"]');
    
    // Check if recording indicator appears
    await expect(page.locator('.recording-indicator')).toBeVisible();
  });
});
```

### Run E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode
npm run test:e2e -- --headed

# Run specific browser
npm run test:e2e -- --project=chromium

# Debug mode
npm run test:e2e -- --debug
```

## Manual Testing Checklist

### Basic Functionality
- [ ] Chat bubble appears on page load
- [ ] Chat opens when bubble is clicked
- [ ] Chat closes with X button
- [ ] Messages send on Enter key
- [ ] Messages send with send button
- [ ] Welcome message displays correctly

### Themes
- [ ] Default theme displays correctly
- [ ] Dark theme switches properly
- [ ] Ocean theme switches properly
- [ ] Sunset theme switches properly
- [ ] Theme persists on page reload

### Voice Input (Chrome/Edge only)
- [ ] Microphone button visible
- [ ] Permission prompt appears
- [ ] Recording indicator shows
- [ ] Speech is transcribed correctly
- [ ] Transcribed text appears in input

### Content Rendering
- [ ] Plain text renders correctly
- [ ] Markdown formatting works
- [ ] Code blocks have syntax highlighting
- [ ] Charts render properly
- [ ] Maps load with API key
- [ ] Tables display correctly
- [ ] Links are clickable
- [ ] Images load properly

### Responsive Design
- [ ] Mobile layout (< 640px)
- [ ] Tablet layout (640px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Keyboard appears correctly on mobile
- [ ] Touch interactions work
- [ ] Scrolling works smoothly

### Streaming
- [ ] Typing indicator shows during streaming
- [ ] Messages appear word by word
- [ ] No UI freezing during streaming
- [ ] Error handling for stream interruption

### Accessibility
- [ ] Tab navigation works
- [ ] Screen reader announces correctly
- [ ] ARIA labels present
- [ ] Keyboard shortcuts work (Esc to close)
- [ ] Focus management correct
- [ ] Color contrast sufficient

### Error Handling
- [ ] Network error displays message
- [ ] API timeout handled gracefully
- [ ] Invalid responses don't crash
- [ ] Rate limiting message shows
- [ ] Reconnection attempts work

### Performance
- [ ] Initial load < 3 seconds
- [ ] Smooth animations (60 fps)
- [ ] No memory leaks
- [ ] Bundle size < 200KB
- [ ] Lazy loading works

## Performance Testing

### Lighthouse Audit

```bash
# Run Lighthouse
npx lighthouse http://localhost:5173 --view

# Key metrics to check:
# - Performance > 90
# - Accessibility > 95
# - Best Practices > 90
# - SEO > 90
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:widget -- --analyze

# Check for:
# - Large dependencies
# - Duplicate modules
# - Unused exports
```

### Load Testing

```javascript
// tests/performance/load.test.js
import { chromium } from 'playwright';

test('handles multiple simultaneous users', async () => {
  const browser = await chromium.launch();
  const contexts = [];
  
  // Create 10 concurrent users
  for (let i = 0; i < 10; i++) {
    const context = await browser.newContext();
    contexts.push(context);
  }
  
  // Each user opens chat and sends messages
  await Promise.all(contexts.map(async (context, i) => {
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.click('[aria-label="Open chat"]');
    await page.fill('input', `User ${i} message`);
    await page.click('[aria-label="Send message"]');
  }));
  
  // Cleanup
  await browser.close();
});
```

## Debugging Tests

### Debug Unit Tests

```bash
# Run with Node debugger
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Use VS Code debugger
# Add to .vscode/launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

### Debug E2E Tests

```bash
# Debug mode
npx playwright test --debug

# With browser tools
PWDEBUG=1 npx playwright test

# Step through test
npx playwright test --headed --workers=1
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm test -- --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            test-results/
            coverage/
```

## Test Data Management

### Fixtures

```javascript
// tests/fixtures/messages.js
export const mockMessages = [
  {
    role: 'user',
    content: 'Hello',
    timestamp: new Date('2024-01-01T10:00:00')
  },
  {
    role: 'assistant',
    content: 'Hi! How can I help you?',
    timestamp: new Date('2024-01-01T10:00:01')
  }
];

// tests/fixtures/charts.js
export const mockChartConfig = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [10, 20, 30]
    }]
  }
};
```

## Best Practices

1. **Test Naming**: Use descriptive names
   ```javascript
   // Good
   test('should display error message when API call fails')
   
   // Bad
   test('error test')
   ```

2. **Test Organization**: Group related tests
   ```javascript
   describe('ChatMessage', () => {
     describe('user messages', () => {
       test('renders text correctly', () => {});
       test('shows timestamp', () => {});
     });
   });
   ```

3. **Mock External Dependencies**
   ```javascript
   jest.mock('@/services/api', () => ({
     sendMessage: jest.fn()
   }));
   ```

4. **Use Test IDs for E2E**
   ```jsx
   <button data-testid="send-button">Send</button>
   ```

5. **Keep Tests Independent**
   ```javascript
   beforeEach(() => {
     // Reset state before each test
     jest.clearAllMocks();
   });
   ```