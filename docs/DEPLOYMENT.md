# Deployment Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Options](#deployment-options)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Security Checklist](#security-checklist)
- [Monitoring](#monitoring)

## Prerequisites

Before deploying, ensure you have:
- ✓ Production API endpoint ready
- ✓ SSL certificate for HTTPS
- ✓ Google Maps API key (if using maps)
- ✓ CDN or hosting service
- ✓ Error tracking service (optional)

## Build Process

### 1. Set Production Environment Variables

Create `.env.production`:
```env
VITE_API_ENDPOINT=https://api.yourcompany.com/chat
VITE_GOOGLE_MAPS_API_KEY=your_production_key
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=GA-XXXXXXXXX
VITE_SENTRY_DSN=https://xxxx@sentry.io/yyyy
```

### 2. Build the Widget

```bash
# Clean previous builds
rm -rf dist

# Build the widget
npm run build:widget

# Verify the build
ls -la dist/
# Should show: chatbot-widget.umd.js
```

### 3. Optimize the Build

```bash
# Check bundle size
npm run build:widget -- --analyze

# Minify further if needed
terser dist/chatbot-widget.umd.js -o dist/chatbot-widget.min.js -c -m

# Gzip the file
gzip -k dist/chatbot-widget.min.js
```

## Deployment Options

### Option 1: CDN Deployment (Recommended)

#### AWS CloudFront

1. Upload to S3:
```bash
aws s3 cp dist/chatbot-widget.umd.js s3://your-bucket/chatbot/v1.0.0/
```

2. Set cache headers:
```bash
aws s3 cp dist/chatbot-widget.umd.js s3://your-bucket/chatbot/v1.0.0/ \
  --cache-control "public, max-age=31536000" \
  --content-type "application/javascript"
```

3. Invalidate CloudFront:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/chatbot/*"
```

#### Cloudflare

1. Upload via Cloudflare Pages:
```bash
# Install Wrangler
npm install -g wrangler

# Deploy
wrangler pages publish dist --project-name=chatbot-widget
```

2. Set up caching rules:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month

### Option 2: NPM Package

1. Prepare package.json:
```json
{
  "name": "@yourcompany/chatbot-widget",
  "version": "1.0.0",
  "description": "Beautiful chatbot widget",
  "main": "dist/chatbot-widget.umd.js",
  "module": "dist/chatbot-widget.esm.js",
  "files": [
    "dist"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/yourcompany/chatbot-widget.git"
  },
  "keywords": ["chatbot", "widget", "react"],
  "license": "MIT"
}
```

2. Publish:
```bash
# Login to npm
npm login

# Publish
npm publish --access public
```

3. Usage:
```bash
npm install @yourcompany/chatbot-widget
```

### Option 3: Self-Hosted

#### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name static.yourcompany.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Chatbot widget location
    location /chatbot/ {
        alias /var/www/chatbot/;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods GET;
        
        # Caching
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        
        # Gzip
        gzip on;
        gzip_types application/javascript;
    }
}
```

#### Apache Configuration

```apache
<VirtualHost *:443>
    ServerName static.yourcompany.com
    DocumentRoot /var/www/chatbot

    <Directory /var/www/chatbot>
        Options -Indexes
        AllowOverride None
        
        # CORS
        Header set Access-Control-Allow-Origin "*"
        
        # Caching
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        
        # Security
        Header set X-Content-Type-Options "nosniff"
        Header set X-Frame-Options "DENY"
    </Directory>

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE application/javascript
    </IfModule>
</VirtualHost>
```

## Environment Configuration

### Integration Code for Different Environments

#### Development
```html
<script>
  ChatbotWidget.init({
    apiEndpoint: 'http://localhost:3001/api/chat',
    debug: true,
    theme: 'default'
  });
</script>
```

#### Staging
```html
<script>
  ChatbotWidget.init({
    apiEndpoint: 'https://staging-api.yourcompany.com/chat',
    debug: true,
    theme: 'default'
  });
</script>
```

#### Production
```html
<script>
  ChatbotWidget.init({
    apiEndpoint: 'https://api.yourcompany.com/chat',
    debug: false,
    theme: 'default',
    enableAnalytics: true
  });
</script>
```

## Performance Optimization

### 1. Enable Compression

```nginx
# Nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/javascript application/javascript;
```

### 2. Set Proper Cache Headers

```nginx
location ~* \.(js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Use a CDN

Benefits:
- Global distribution
- Automatic compression
- DDoS protection
- SSL termination

### 4. Lazy Load the Widget

```javascript
// Load widget only when needed
function loadChatbot() {
  const script = document.createElement('script');
  script.src = 'https://cdn.yourcompany.com/chatbot-widget.umd.js';
  script.onload = () => {
    ChatbotWidget.init({
      apiEndpoint: 'https://api.yourcompany.com/chat'
    });
  };
  document.head.appendChild(script);
}

// Load on user interaction
document.addEventListener('click', loadChatbot, { once: true });
```

## Security Checklist

- [ ] Use HTTPS for all resources
- [ ] Implement Content Security Policy (CSP)
- [ ] Set security headers (X-Frame-Options, X-Content-Type-Options)
- [ ] Validate and sanitize all inputs
- [ ] Implement rate limiting on API
- [ ] Use SRI (Subresource Integrity) for CDN resources
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Content Security Policy Example

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.yourcompany.com; 
               style-src 'self' 'unsafe-inline';
               connect-src 'self' https://api.yourcompany.com;
               img-src 'self' data: https:;
               font-src 'self';">
```

### Subresource Integrity

```html
<script 
  src="https://cdn.yourcompany.com/chatbot-widget.umd.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
  crossorigin="anonymous">
</script>
```

## Monitoring

### 1. Error Tracking (Sentry)

```javascript
// In your widget code
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
});
```

### 2. Analytics

```javascript
// Track widget usage
window.gtag('event', 'chatbot_opened', {
  event_category: 'engagement',
  event_label: 'widget'
});
```

### 3. Performance Monitoring

```javascript
// Monitor load time
window.addEventListener('load', () => {
  const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
  
  // Send to analytics
  window.gtag('event', 'timing_complete', {
    name: 'chatbot_widget_load',
    value: loadTime,
    event_category: 'performance'
  });
});
```

### 4. Uptime Monitoring

Services to consider:
- Pingdom
- UptimeRobot
- StatusCake

## Rollback Strategy

### Version Management

```bash
# Deploy with version
aws s3 cp dist/chatbot-widget.umd.js s3://your-bucket/chatbot/v1.0.0/
aws s3 cp dist/chatbot-widget.umd.js s3://your-bucket/chatbot/latest/

# Rollback
aws s3 cp s3://your-bucket/chatbot/v0.9.9/chatbot-widget.umd.js \
         s3://your-bucket/chatbot/latest/chatbot-widget.umd.js
```

### Feature Flags

```javascript
ChatbotWidget.init({
  features: {
    voiceInput: true,
    streaming: true,
    newUI: false // Can toggle features
  }
});
```

## Post-Deployment Checklist

- [ ] Verify widget loads correctly
- [ ] Test all features (chat, voice, themes)
- [ ] Check error tracking is working
- [ ] Verify analytics are recording
- [ ] Test on multiple devices/browsers
- [ ] Monitor performance metrics
- [ ] Check security headers
- [ ] Test fallback scenarios
- [ ] Document deployment version
- [ ] Update status page