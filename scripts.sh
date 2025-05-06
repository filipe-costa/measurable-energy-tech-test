# Build carbon-intensity-api service image
docker buildx build -t carbon-intensity-api ./api
# Run api and database services
docker compose -f ./api/docker-compose.yaml up -d

# Change directory
cd ui
# Install node_modules
npm install
# Start UI
npm run dev