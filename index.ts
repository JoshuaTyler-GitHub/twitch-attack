// node_modules
import fs from 'fs';
import puppeteer, { Browser } from 'puppeteer';

/**
 * @constants
 */
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36';

const BROWSER_COUNT: number = 10;
const MAX_RUNTIME: number = 300000; // 5 minutes
const SCREENSHOT_INTERVAL: number = 5000; // 5 seconds
const URI: string = 'https://www.twitch.tv/userToTarget';
// const URI: string = 'https://www.google.com';

/**
 * @params
 */
let browsers: Browser[] = [];
let interval: NodeJS.Timeout;

async function pollScreenShots() {
  interval = setInterval(() => {
    browsers.forEach(async (browser, index) => {
      const page = (await browser.pages())[1];
      const pageViewport = page.viewport();
      console.log('pageViewport', pageViewport);
      const pageUrl = page.url();
      const screenshot = await page.screenshot();
      fs.writeFileSync(`screenshot-${index}.png`, screenshot);
      console.log(
        `Screenshot taken for browser: [${index}] on page: [${pageUrl}].`,
      );
    });
  }, SCREENSHOT_INTERVAL);
}

async function twitchAttack() {
  // start browsers
  for (let i = 0; i < BROWSER_COUNT; i++) {
    try {
      // create browser
      const browser = await puppeteer.launch();
      browsers.push(browser);
      console.log(`Browser started: [${i}].`);

      // create page
      const page = await browser.newPage();
      await page.setUserAgent(USER_AGENT);
      await page.setViewport({ width: 1080, height: 1024 });

      // load page
      await page.goto(URI);
    } catch (error) {
      console.error(error);
    }
  }

  // poll screenshots
  pollScreenShots();
}

async function killBrowsers() {
  try {
    await Promise.all(
      browsers.map(async (browser, index) => {
        browser.close();
        console.log(`Browser stopped: [${index}].`);
      }),
    );
  } catch (error) {
    console.error(error);
  }
}

async function killProgram() {
  clearInterval(interval);
  await killBrowsers();
  process.exit();
}

// start
twitchAttack();

// kill after max timeout
setTimeout(async () => {
  await killProgram();
}, MAX_RUNTIME);

// listen for exit signal
process.on('SIGINT', async () => {
  await killProgram();
});
