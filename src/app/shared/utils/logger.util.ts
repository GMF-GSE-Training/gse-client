/**
 * Logger Utility - 2025 Best Practices
 * 
 * Provides environment-aware logging that automatically disables console output
 * in production environments while maintaining debug capabilities in development.
 * 
 * Usage:
 * - Logger.debug('Debug message', data)
 * - Logger.info('Info message', data)
 * - Logger.warn('Warning message', data)
 * - Logger.error('Error message', error)
 */

import { Injectable } from '@angular/core';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

@Injectable({
  providedIn: 'root'
})
export class Logger {
  private static isDevelopment(): boolean {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    
    const DEVELOPMENT_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];
    const DEVELOPMENT_PORTS = ['4200', '3000', '8080', '8000', '9000', '4000', '5000'];
    const PRODUCTION_DOMAINS = ['gmf-aeroasia.publicvm.com', 'gmf-aeroasia.com'];
    
    const isLocalhost = DEVELOPMENT_HOSTNAMES.includes(hostname);
    const isDevPort = DEVELOPMENT_PORTS.includes(port);
    const isHttp = protocol === 'http:';
    const isLocalNetwork = this.isLocalNetworkAddress(hostname);
    const isProductionDomain = PRODUCTION_DOMAINS.some(domain => hostname.includes(domain));
    
    return isLocalhost || isDevPort || isLocalNetwork || (isHttp && !isProductionDomain);
  }

  private static isLocalNetworkAddress(hostname: string): boolean {
    const localNetworkPatterns = [
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];
    return localNetworkPatterns.some(pattern => pattern.test(hostname));
  }

  private static getLogLevel(): LogLevel {
    return this.isDevelopment() ? LogLevel.DEBUG : LogLevel.ERROR;
  }

  private static shouldLog(level: LogLevel): boolean {
    return level <= this.getLogLevel();
  }

  private static formatMessage(level: string, message: string, prefix?: string): string {
    const timestamp = new Date().toISOString();
    const prefixStr = prefix ? `[${prefix}] ` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${prefixStr}${message}`;
  }

  static debug(message: string, data?: any, prefix?: string): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage('debug', message, prefix);
      if (data !== undefined) {
        console.debug(formattedMessage, data);
      } else {
        console.debug(formattedMessage);
      }
    }
  }

  static info(message: string, data?: any, prefix?: string): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMessage = this.formatMessage('info', message, prefix);
      if (data !== undefined) {
        console.info(formattedMessage, data);
      } else {
        console.info(formattedMessage);
      }
    }
  }

  static warn(message: string, data?: any, prefix?: string): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const formattedMessage = this.formatMessage('warn', message, prefix);
      if (data !== undefined) {
        console.warn(formattedMessage, data);
      } else {
        console.warn(formattedMessage);
      }
    }
  }

  static error(message: string, error?: any, prefix?: string): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMessage = this.formatMessage('error', message, prefix);
      if (error !== undefined) {
        console.error(formattedMessage, error);
      } else {
        console.error(formattedMessage);
      }
    }
  }

  // Environment info (shown only in development)
  static envInfo(message: string, data?: any): void {
    if (this.isDevelopment()) {
      console.log(`🔍 Environment: ${message}`, data);
    }
  }

  // Force logging (even in production) - use sparingly for critical errors
  static forceLog(message: string, data?: any): void {
    console.log(`[FORCE] ${message}`, data);
  }

  // Get current environment status
  static getEnvironmentInfo(): { isDevelopment: boolean; logLevel: LogLevel } {
    return {
      isDevelopment: this.isDevelopment(),
      logLevel: this.getLogLevel()
    };
  }
}

// Export as default for easy importing
export default Logger;
