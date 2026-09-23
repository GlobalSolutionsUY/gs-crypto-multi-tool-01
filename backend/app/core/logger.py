"""Logging configuration and structured JSONL logging for Crypto Multi-Tool."""

import json
import logging
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from app.core.config import get_settings


def setup_logging() -> logging.Logger:
    """Configure and return root application logger."""
    settings = get_settings()

    # Ensure log directory exists
    log_path = Path(settings.logs_dir)
    log_path.mkdir(parents=True, exist_ok=True)

    log_level = getattr(logging, settings.log_level.upper(), logging.INFO)

    # Standard console format
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    console_handler.setLevel(log_level)

    logger = logging.getLogger("cmt")
    logger.setLevel(log_level)

    # Avoid duplicate handlers on re-initialization
    if not logger.handlers:
        logger.addHandler(console_handler)

    logger.propagate = False
    return logger


def log_alert_jsonl(record: dict[str, Any]) -> None:
    """Append a structured alert record to logs/alerts.jsonl with UTC timestamp."""
    settings = get_settings()
    log_path = Path(settings.logs_dir)
    log_path.mkdir(parents=True, exist_ok=True)

    file_path = log_path / "alerts.jsonl"
    record_with_meta = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **record,
    }

    with open(file_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record_with_meta, ensure_ascii=False) + "\n")


logger = setup_logging()
