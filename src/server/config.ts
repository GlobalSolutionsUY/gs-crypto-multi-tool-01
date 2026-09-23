/**
 * Application Configuration & Environment Settings (TypeScript)
 */

import path from "node:path";

export interface AppConfig {
  environment: string;
  isProduction: boolean;
  port: number;
  host: string;
  binance: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl: string;
    hasAuth: boolean;
  };
  telegram: {
    botToken?: string;
    chatId?: string;
    hasAuth: boolean;
  };
  paths: {
    logsDir: string;
    artifactsDir: string;
    distDir: string;
  };
}

export function getConfig(): AppConfig {
  const env = process.env.NODE_ENV || "production";
  const isProduction = env.toLowerCase() === "production";
  const apiKey = process.env.BINANCE_API_KEY || undefined;
  const apiSecret = process.env.BINANCE_API_SECRET || undefined;
  const botToken = process.env.TELEGRAM_BOT_TOKEN || undefined;
  const chatId = process.env.TELEGRAM_CHAT_ID || undefined;

  const rootDir = process.cwd();

  return {
    environment: env,
    isProduction,
    port: Number(process.env.PORT) || 8000,
    host: process.env.HOST || "0.0.0.0",
    binance: {
      apiKey,
      apiSecret,
      baseUrl: process.env.BINANCE_BASE_URL || "https://api.binance.com",
      hasAuth: Boolean(apiKey && apiSecret),
    },
    telegram: {
      botToken,
      chatId,
      hasAuth: Boolean(botToken && chatId),
    },
    paths: {
      logsDir: path.resolve(rootDir, process.env.LOGS_DIR || "logs"),
      artifactsDir: path.resolve(rootDir, process.env.ARTIFACTS_DIR || "artifacts"),
      distDir: path.resolve(rootDir, "dist"),
    },
  };
}

export const config = getConfig();
