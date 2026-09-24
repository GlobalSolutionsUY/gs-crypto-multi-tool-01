/**
 * Structured Logger & JSONL Audit Trail (TypeScript)
 */

import fs from "node:fs";
import path from "node:path";
import { config } from "./config";

export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private auditLogPath: string;

  constructor() {
    this.auditLogPath = path.join(config.paths.logsDir, "audit.jsonl");
    this.ensureLogDir();
  }

  private ensureLogDir(): void {
    try {
      if (!fs.existsSync(config.paths.logsDir)) {
        fs.mkdirSync(config.paths.logsDir, { recursive: true });
      }
    } catch {
      // Fallback if filesystem permissions restrict directory creation
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && Object.keys(context).length > 0 ? { context } : {}),
    };

    const formattedMessage = `[${entry.timestamp}] [${level}] ${message} ${
      context ? JSON.stringify(context) : ""
    }`.trim();

    if (level === "ERROR") {
      console.error(formattedMessage);
    } else if (level === "WARN") {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }

    this.writeAudit(entry);
  }

  private writeAudit(entry: LogEntry): void {
    try {
      const line = `${JSON.stringify(entry)}\n`;
      fs.appendFileSync(this.auditLogPath, line, "utf8");
    } catch {
      // Silent catch to prevent logging failure from crashing the runtime
    }
  }

  debug(msg: string, ctx?: Record<string, unknown>): void {
    this.log("DEBUG", msg, ctx);
  }

  info(msg: string, ctx?: Record<string, unknown>): void {
    this.log("INFO", msg, ctx);
  }

  warn(msg: string, ctx?: Record<string, unknown>): void {
    this.log("WARN", msg, ctx);
  }

  error(msg: string, ctx?: Record<string, unknown>): void {
    this.log("ERROR", msg, ctx);
  }
}

export const logger = new Logger();
