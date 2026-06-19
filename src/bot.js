// src/bot.js
// Minimal Playwright bot (Node.js)
// Install: npm ci && npx playwright install
require('dotenv').config();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // TODO: replace these URLs and selectors with your site's actual values
    const LOGIN_URL = 'https://example.com/login';
    const NEW_POST_URL = 'https://example.com/new-post';

    // Login
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
    await page.fill('input[name="username"]', process.env.BOT_USER || '');
    await page.fill('input[name="password"]', process.env.BOT_PASS || '');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 })
    ]);

    // Example action: create a new post
    await page.goto(NEW_POST_URL, { waitUntil: 'networkidle' });
    await page.fill('#title', `Automated post ${new Date().toISOString()}`);
    await page.fill('#body', 'This post was created by an automated bot.');
    await page.click('button#publish');

    // Wait for confirmation (adjust selector to your site)
    await page.waitForSelector('.notification-success', { timeout: 10000 });
    console.log('Bot: action completed successfully');

  } catch (err) {
    console.error('Bot error:', err.message || err);
    try {
      await page.screenshot({ path: 'error.png', fullPage: true });
      console.log('Saved error.png');
    } catch (e) { /* ignore */ }
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
