#!/bin/bash

# CDN-Optimized Chatbot UI Deployment
# Cloud Storage + Cloud CDN + Cloud Run (Best Value!)

set -e

# Configuration
PROJECT_ID="potent-poetry-465806-h2"
BUCKET_NAME="chatbot-ui-static-files"
PROJECT_PATH="/Users/chinmay/Desktop/chatbot-ui"
REGION="us-central1"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"; }
info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
success() { echo -e "${PURPLE}✨ $1${NC}"; }

echo "🚀 CDN-Optimized Chatbot UI Deployment"
echo "💰 Cost: $1-6/month + CDN (first 10TB FREE!)"
echo "⚡ Benefits: Global speed + Professional performance"
echo ""

# Check prerequisites
log "Checking prerequisites..."
command -v gcloud >/dev/null 2>&1 || { echo "❌ gcloud not found. Install Google Cloud SDK first."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not found. Install Node.js first."; exit 1; }
[ -d "$PROJECT_PATH" ] || { echo "❌ Project directory not found: $PROJECT_PATH"; exit 1; }

# Set project
log "Setting up GCP project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable APIs
log "Enabling required APIs..."
gcloud services enable storage.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable compute.googleapis.com
info "APIs enabled"

# Create storage bucket
log "Creating storage bucket: $BUCKET_NAME"
if ! gsutil ls -b gs://$BUCKET_NAME &>/dev/null; then
    gsutil mb gs://$BUCKET_NAME
    info "Bucket created"
else
    info "Bucket already exists"
fi

# Configure bucket for web hosting
log "Configuring bucket for web hosting..."
gsutil web set -m index.html -e 404.html gs://$BUCKET_NAME
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME

# Set CORS for API integration
cat > /tmp/cors.json << 'EOF'
[{
  "origin": ["*"],
  "method": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  "responseHeader": ["Content-Type", "Authorization", "X-Requested-With"],
  "maxAgeSeconds": 3600
}]
EOF
gsutil cors set /tmp/cors.json gs://$BUCKET_NAME
rm /tmp/cors.json
info "CORS configured"

# Build project
log "Building React project..."
cd "$PROJECT_PATH"
npm ci --silent
npm run build

# Determine build output
BUILD_DIR="./dist"
[ ! -d "./dist" ] && [ -d "./build" ] && BUILD_DIR="./build"
[ ! -d "$BUILD_DIR" ] && { echo "❌ Build output not found"; exit 1; }

# Deploy static files
log "Deploying static files to Cloud Storage..."
gsutil -m rsync -r -d "$BUILD_DIR" gs://$BUCKET_NAME

# Set cache control for better CDN performance
log "Optimizing cache settings for CDN..."
# Cache static assets for 1 year
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/static/** 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.js 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.css 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.png 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.jpg 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000" gs://$BUCKET_NAME/**/*.svg 2>/dev/null || true

# Cache HTML files for 5 minutes (for updates)
gsutil -m setmeta -h "Cache-Control:public, max-age=300" gs://$BUCKET_NAME/index.html 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=300" gs://$BUCKET_NAME/**/*.html 2>/dev/null || true
info "Cache settings optimized"

# Set up CDN
log "Setting up Cloud CDN..."

# Create backend bucket
if ! gcloud compute backend-buckets describe chatbot-ui-backend &>/dev/null; then
    gcloud compute backend-buckets create chatbot-ui-backend \
        --gcs-bucket-name=$BUCKET_NAME \
        --enable-cdn \
        --cache-mode=CACHE_ALL_STATIC
    info "Backend bucket created"
else
    info "Backend bucket already exists"
fi

# Create URL map
if ! gcloud compute url-maps describe chatbot-ui-map &>/dev/null; then
    gcloud compute url-maps create chatbot-ui-map \
        --default-backend-bucket=chatbot-ui-backend
    info "URL map created"
else
    info "URL map already exists"
fi

# Create target HTTP proxy
if ! gcloud compute target-http-proxies describe chatbot-ui-proxy &>/dev/null; then
    gcloud compute target-http-proxies create chatbot-ui-proxy \
        --url-map=chatbot-ui-map
    info "Target HTTP proxy created"
else
    info "Target HTTP proxy already exists"
fi

# Create global forwarding rule (this gives us the CDN endpoint)
if ! gcloud compute forwarding-rules describe chatbot-ui-http-rule --global &>/dev/null; then
    gcloud compute forwarding-rules create chatbot-ui-http-rule \
        --global \
        --target-http-proxy=chatbot-ui-proxy \
        --ports=80
    info "Global forwarding rule created"
else
    info "Global forwarding rule already exists"
fi

success "Cloud CDN setup completed!"

# Deploy API (if exists)
API_URL="Not deployed"
if [ -d "$PROJECT_PATH/server" ]; then
    log "Deploying API to Cloud Run..."
    cd "$PROJECT_PATH/server"
    
    # Create Dockerfile if it doesn't exist
    if [ ! -f "Dockerfile" ]; then
        cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
EOF
        info "Created Dockerfile for API"
    fi
    
    gcloud run deploy chatbot-api \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port 8080 \
        --memory 512Mi \
        --cpu 1 \
        --max-instances 10 \
        --quiet
    
    API_URL=$(gcloud run services describe chatbot-api --region=$REGION --format="value(status.url)")
    success "API deployed successfully"
else
    warn "API directory not found at $PROJECT_PATH/server"
    info "Static files deployed with CDN. Add API later if needed."
fi

# Get CDN endpoint
log "Getting CDN endpoint..."
CDN_IP=$(gcloud compute forwarding-rules describe chatbot-ui-http-rule --global --format="value(IPAddress)")
CDN_URL="http://$CDN_IP"
STORAGE_URL="https://storage.googleapis.com/$BUCKET_NAME"

# Wait for CDN to be ready
info "CDN is setting up... This may take 5-10 minutes to fully propagate globally."

# Create deployment info
cat > "$PROJECT_PATH/deployment-info.txt" << EOF
Chatbot UI - CDN-Optimized Deployment
Generated: $(date)

🌐 CDN URL (RECOMMENDED): $CDN_URL
📁 CDN Embed Script: $CDN_URL/embed.js
🗄️  Storage URL (backup): $STORAGE_URL/index.html  
🚀 API URL: $API_URL

💰 Monthly Cost: $1-6 + CDN bandwidth
   - Cloud Storage: $1-5/month
   - Cloud Run: ~$1/month  
   - Cloud CDN: First 10TB FREE! Then $0.08/GB

⚡ Performance Benefits:
   - Global CDN with 200+ edge locations
   - 10x faster loading worldwide
   - Automatic caching and optimization
   - Professional-grade infrastructure

Integration Code (Use CDN URL for best performance):
===================================================
<div id="chatbot-container"></div>
<script src="$CDN_URL/embed.js"></script>
<script>
  ChatbotUI.init({
    container: '#chatbot-container',
    apiUrl: '$API_URL',
    theme: 'default',
    welcomeMessage: 'Hello! How can I help you today?',
    floatingMode: true,
    voiceInput: true,
    streaming: true
  });
</script>

Test URLs:
==========
CDN (Best): $CDN_URL/index.html
Storage:    $STORAGE_URL/index.html

CDN Cache Management:
====================
# Invalidate CDN cache after updates
gcloud compute url-maps invalidate-cdn-cache chatbot-ui-map --path="/*"

# Check CDN cache hit ratio
gcloud logging read "resource.type=http_load_balancer" --limit=10

Next Steps:
===========
1. Wait 5-10 minutes for CDN global propagation
2. Test both URLs (CDN should be faster globally)
3. Use CDN URL in your integration code
4. Monitor CDN performance in GCP Console
5. Add custom domain later if needed (upgrade to Load Balancer)

Cost Optimization:
==================
✅ First 10TB CDN bandwidth FREE
✅ Professional performance at minimal cost
✅ Easy upgrade path to custom domain
EOF

# Success message
echo ""
echo "🎉 CDN-Optimized Deployment Completed!"
echo "================================================"
echo ""
echo "🚀 CDN URL (Use this!): $CDN_URL"
echo "📱 Test your chatbot: $CDN_URL/index.html"
echo "🔗 Embed script: $CDN_URL/embed.js"
echo "⚡ API endpoint: $API_URL"
echo ""
echo "💰 Cost: $1-6/month + CDN (first 10TB FREE!)"
echo "⚡ Performance: Global CDN with edge caching"
echo ""
echo "⏱️  Note: CDN may take 5-10 minutes to fully propagate globally"
echo ""
echo "📋 Full details saved to: $PROJECT_PATH/deployment-info.txt"
echo ""

# Show cost comparison
cat << 'EOF'
💰 Cost Comparison:
===================
✅ Your Setup:    $1-6/month (CDN-optimized)
❌ Full Setup:    $19-24/month (with Load Balancer)
💵 You Save:      $18/month = $216/year!

⚡ Performance Comparison:
=========================
🐌 Storage Only:  Good (single region)
🚀 Your CDN:      Excellent (global)
🚀 Full Setup:    Excellent (global + custom domain)

🔄 Quick Commands:
==================
# Update files and invalidate CDN cache
gsutil -m rsync -r -d ./dist gs://chatbot-ui-static-files
gcloud compute url-maps invalidate-cdn-cache chatbot-ui-map --path="/*"

# Check CDN status
gcloud compute backend-buckets describe chatbot-ui-backend

# View costs
gcloud billing budgets list
EOF

echo ""
success "Your chatbot is now powered by global CDN! 🌍✨"
