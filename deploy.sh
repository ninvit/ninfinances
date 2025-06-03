#!/bin/bash

# Build das imagens
echo "Building images..."
docker-compose build

# Tag das imagens
echo "Tagging images..."
docker tag ninfinances/backend:latest ninfinances/backend:latest
docker tag ninfinances/frontend:latest ninfinances/frontend:latest

# Push das imagens
echo "Pushing images to Docker Hub..."
docker push ninfinances/backend:latest
docker push ninfinances/frontend:latest

echo "Done!" 