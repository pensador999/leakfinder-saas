// ==============================================================================
// 🏊 BROWSER POOL & CONCURRENCY MANAGER (MCP WORKER)
// Manages Chromium browser lifecycle, concurrency limits, and auto-recycling.
// ==============================================================================

import puppeteer, { Browser, Page } from 'puppeteer-core';
import os from 'os';
import fs from 'fs';

export interface PoolMetrics {
  activePages: number;
  totalRequestsServed: number;
  browserUptimeSeconds: number;
  memoryUsageMb: number;
  isHealthy: boolean;
}

export class BrowserPool {
  private browser: Browser | null = null;
  private activePagesCount = 0;
  private totalRequestsServed = 0;
  private launchedAt = 0;
  private maxConcurrentPages: number;
  private maxRequestsBeforeRecycle: number;
  private executablePath: string;

  constructor(maxConcurrent = 4, maxRequestsBeforeRecycle = 100) {
    this.maxConcurrentPages = maxConcurrent;
    this.maxRequestsBeforeRecycle = maxRequestsBeforeRecycle;
    this.executablePath = this.resolveChromiumPath();
  }

  private resolveChromiumPath(): string {
    // 1. Explicit environment variable
    if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) {
      return process.env.CHROMIUM_PATH;
    }

    // 2. Standard Linux container paths (Debian / Alpine)
    const linuxPaths = [
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/usr/bin/google-chrome-stable'
    ];

    for (const p of linuxPaths) {
      if (fs.existsSync(p)) return p;
    }

    // 3. Windows local dev fallback
    if (os.platform() === 'win32') {
      const winPaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
      ];
      for (const p of winPaths) {
        if (fs.existsSync(p)) return p;
      }
    }

    // Default fallback
    return '/usr/bin/chromium';
  }

  private async getOrCreateBrowser(): Promise<Browser> {
    if (this.browser && this.browser.isConnected()) {
      if (this.totalRequestsServed >= this.maxRequestsBeforeRecycle && this.activePagesCount === 0) {
        console.log(`[BrowserPool] Reciclando instância do Chromium após ${this.totalRequestsServed} requisições...`);
        await this.browser.close().catch(() => {});
        this.browser = null;
      } else {
        return this.browser;
      }
    }

    console.log(`[BrowserPool] Inicializando nova instância do Chromium (${this.executablePath})...`);
    this.browser = await puppeteer.launch({
      executablePath: this.executablePath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-audio-output',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--no-first-run',
        '--no-zygote',
        '--window-size=1280,900'
      ]
    });

    this.launchedAt = Date.now();
    this.totalRequestsServed = 0;
    return this.browser;
  }

  /**
   * Executes a callback within a managed page context.
   */
  public async withPage<T>(fn: (page: Page) => Promise<T>): Promise<T> {
    while (this.activePagesCount >= this.maxConcurrentPages) {
      await new Promise(r => setTimeout(r, 100));
    }

    this.activePagesCount++;
    this.totalRequestsServed++;

    let page: Page | null = null;
    try {
      const browser = await this.getOrCreateBrowser();
      page = await browser.newPage();

      // Configure desktop user-agent and viewport
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1280, height: 900 });

      // Block unnecessary heavy resources to save CPU and network
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['media', 'font'].includes(resourceType)) {
          req.abort();
        } else {
          req.continue();
        }
      });

      return await fn(page);
    } finally {
      if (page) {
        await page.close().catch(() => {});
      }
      this.activePagesCount--;
    }
  }

  public getMetrics(): PoolMetrics {
    const mem = process.memoryUsage();
    return {
      activePages: this.activePagesCount,
      totalRequestsServed: this.totalRequestsServed,
      browserUptimeSeconds: this.launchedAt > 0 ? Math.floor((Date.now() - this.launchedAt) / 1000) : 0,
      memoryUsageMb: Math.round(mem.rss / 1024 / 1024),
      isHealthy: this.browser ? this.browser.isConnected() : true
    };
  }

  public async shutdown(): Promise<void> {
    if (this.browser) {
      console.log('[BrowserPool] Encerrando instâncias do Chromium...');
      await this.browser.close().catch(() => {});
      this.browser = null;
    }
  }
}
