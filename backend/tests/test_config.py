"""Tests for backend configuration and environment loading."""

from app.core.config import Settings


def test_default_settings():
    """Verify default settings configuration."""
    settings = Settings(
        environment="development",
        binance_api_key=None,
        binance_api_secret=None,
        telegram_bot_token=None,
        telegram_chat_id=None,
    )
    assert settings.environment == "development"
    assert not settings.is_production
    assert not settings.has_binance_auth
    assert not settings.has_telegram_auth
    assert settings.backend_port == 8000
    assert settings.mcp_server_port == 8001


def test_auth_detection():
    """Verify authentication state detection."""
    settings = Settings(
        binance_api_key="test_key",
        binance_api_secret="test_secret",
        telegram_bot_token="test_token",
        telegram_chat_id="12345",
    )
    assert settings.has_binance_auth
    assert settings.has_telegram_auth
