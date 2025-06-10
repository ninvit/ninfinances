#!/bin/bash

# Deploy script for NinFinances
echo "🚀 Deploying NinFinances to Heroku..."

# Build the application
echo "📦 Building application..."
./mvnw clean package -DskipTests

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Add files to git
    echo "📝 Committing changes..."
    git add .
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Deploy to Heroku
    echo "🚀 Deploying to Heroku..."
    git push heroku main
    
    # Open app in browser
    echo "🌐 Opening app..."
    heroku open
    
    echo "✅ Deploy completed!"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi 