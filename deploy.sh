#!/bin/bash

# RE/MAX VIP Belize - Deployment Script
echo "🚀 Starting RE/MAX VIP Belize deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

# Install dependencies
echo "📦 Installing Cloud Functions dependencies..."
cd functions
npm install
cd ..

# Deploy Cloud Functions
echo "🔥 Deploying Cloud Functions..."
firebase deploy --only functions

# Deploy hosting and database rules
echo "🌐 Deploying hosting and database rules..."
firebase deploy --only hosting,firestore

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 Your RE/MAX VIP Belize landing page is now live!"
echo ""
echo "📋 Next steps:"
echo "1. Set up email configuration:"
echo "   firebase functions:config:set email.user=\"your-email@gmail.com\""
echo "   firebase functions:config:set email.pass=\"your-app-password\""
echo ""
echo "2. Create admin user in Firebase Console > Authentication"
echo ""
echo "3. Access your site at: https://vip-affiliates-d265a.web.app"
echo "4. Access admin panel at: https://vip-affiliates-d265a.web.app/admin.html"
echo ""
echo "🔗 For affiliate links, use format: https://vip-affiliates-d265a.web.app?affiliate=AFFILIATE_ID"
echo ""
echo "🌐 To set up custom domain (affiliate.unroutedbelize.com):"
echo "   - Go to Firebase Console > Hosting"
echo "   - Click 'Add custom domain'"
echo "   - Enter: affiliate.unroutedbelize.com"
echo "   - Follow DNS configuration instructions" 