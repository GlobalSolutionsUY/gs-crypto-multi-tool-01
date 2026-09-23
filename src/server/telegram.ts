/**
 * Mobile Notification Dispatcher (Telegram Bot API via native fetch)
 */

import { config } from "./config";
import { logger } from "./logger";

export class TelegramDispatcher {
  private botToken?: string;
  private chatId?: string;

  constructor() {
    this.botToken = config.telegram.botToken;
    this.chatId = config.telegram.chatId;
  }

  get isConfigured(): boolean {
    return Boolean(this.botToken && this.chatId);
  }

  /**
   * Dispatch a formatted text alert to the configured operators' Telegram chat.
   */
  async sendMessage(text: string, parseMode: "Markdown" | "HTML" = "Markdown"): Promise<boolean> {
    if (!this.isConfigured) {
      logger.debug("Telegram alert skipped: bot credentials not configured");
      return false;
    }

    const endpoint = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: parseMode,
          disable_web_page_preview: true,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        logger.error("Failed to send Telegram message", { status: res.status, error: errorText });
        return false;
      }

      logger.info("Telegram alert dispatched successfully");
      return true;
    } catch (err) {
      logger.error("Network error sending Telegram message", {
        error: err instanceof Error ? err.message : String(err),
      });
      return false;
    }
  }
}

export const telegramDispatcher = new TelegramDispatcher();
