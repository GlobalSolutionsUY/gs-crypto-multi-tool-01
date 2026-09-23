"""Application configuration and environment settings using Pydantic Settings."""

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for Crypto Multi-Tool backend."""

    # Environment & Logging
    environment: str = Field(default="development", description="Current runtime environment (development/production)")
    log_level: str = Field(default="INFO", description="Log level (DEBUG, INFO, WARNING, ERROR)")

    # Binance Market Data Adapter (Read-Only)
    # Optional in development; unauthenticated public endpoints are used when omitted
    binance_api_key: str | None = Field(default=None, description="Optional Binance API Key")
    binance_api_secret: str | None = Field(default=None, description="Optional Binance API Secret")
    binance_base_url: str = Field(default="https://api.binance.com", description="Base URL for Binance REST API")

    # Telegram Dispatcher (Push Notifications)
    telegram_bot_token: str | None = Field(default=None, description="Telegram Bot Token for alert dispatch")
    telegram_chat_id: str | None = Field(default=None, description="Telegram Chat ID for operators")

    # Network Ports
    backend_port: int = Field(default=8000, description="FastAPI listening port")
    mcp_server_port: int = Field(default=8001, description="FastMCP server listening port")
    web_port: int = Field(default=3000, description="Web Cockpit port")

    # Storage Paths
    logs_dir: Path = Field(default=Path("logs"), description="Directory path for audit JSONL logs")
    artifacts_dir: Path = Field(default=Path("artifacts"), description="Directory path for generated chart PNGs")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def is_production(self) -> bool:
        """Return True if running in production mode."""
        return self.environment.lower() == "production"

    @property
    def has_binance_auth(self) -> bool:
        """Return True if Binance API credentials are provided."""
        return bool(self.binance_api_key and self.binance_api_secret)

    @property
    def has_telegram_auth(self) -> bool:
        """Return True if Telegram Bot credentials are provided."""
        return bool(self.telegram_bot_token and self.telegram_chat_id)


@lru_cache
def get_settings() -> Settings:
    """Return cached instance of application settings."""
    return Settings()
