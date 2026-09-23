"""Crypto Multi-Tool - Backend Core Engine & FastAPI Service."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logger import logger

settings = get_settings()

app = FastAPI(
    title="Crypto Multi-Tool Engine",
    description="Quantitative Spot Radar and Copilot backend",
    version="0.1.0",
)

# Enable CORS for Web Cockpit
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    """Log application startup and environment status."""
    logger.info("Starting Crypto Multi-Tool backend [env=%s]", settings.environment)
    logger.info("Binance Auth configured: %s", settings.has_binance_auth)
    logger.info("Telegram Auth configured: %s", settings.has_telegram_auth)


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
async def health_check() -> dict:
    """Return service health status and basic environment metadata."""
    return {
        "status": "healthy",
        "service": "crypto-multi-tool-backend",
        "environment": settings.environment,
        "binance_auth": settings.has_binance_auth,
        "telegram_auth": settings.has_telegram_auth,
    }
