.PHONY: help up down dev-frontend dev-backend local-node deploy-local clean

help:
	@echo "🛡️  AegisGuard.init Development Shortcuts"
	@echo ""
	@echo "--- 🐳 Docker Commands (Recommended for Judges) ---"
	@echo "  make up            - Build and start the entire stack via Docker Compose"
	@echo "  make down          - Stop and remove the Docker containers"
	@echo ""
	@echo "--- 💻 Native Commands (For rapid local development) ---"
	@echo "  make dev-frontend  - Start the Next.js UI on port 3000"
	@echo "  make dev-backend   - Start the FastAPI engine on port 8000"
	@echo "  make local-node    - Start the Anvil local blockchain on port 8545"
	@echo "  make deploy-local  - Deploy AegisGuard.sol to the local Anvil node"
	@echo ""
	@echo "--- 🧹 Utilities ---"
	@echo "  make clean         - Remove node_modules and python caches"

# ==============================================================================
# Docker Environment
# ==============================================================================
up:
	docker compose up --build

down:
	docker compose down

# ==============================================================================
# Native Environment
# ==============================================================================
dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && uvicorn main:app --reload --port 8000

local-node:
	anvil

deploy-local:
	cd contracts && PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script scripts/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast

# ==============================================================================
# Utility / Cleanup
# ==============================================================================
clean:
	rm -rf frontend/node_modules
	rm -rf frontend/.next
	rm -rf backend/__pycache__
	rm -rf backend/.venv
