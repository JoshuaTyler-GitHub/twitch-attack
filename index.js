// node_modules
import puppeteer from 'puppeteer';

// utils
import UidUtils from './UidUtils.js';

// connections
const BROWSER_COUNT = Number('10');
const MAX_RUNTIME = Number('1000000');
const URI = String('https://www.twitch.tv/vanessabob');
let browsers = [];

async function killBrowsers() {
  try {
    await Promise.all(browsers.map(async (browser) => {
      browser.close()
      console.log(`Browser stopped: "${browser.id}".`);
    }));
  } catch (error) {
    console.error(error);
  }
}

async function killProgram() {
  await killBrowsers();
  process.exit();
}

async function twitchAttack() {
  for (let i = 0; i < BROWSER_COUNT; i++) {
    const browser = await puppeteer.launch();
    browser.id = UidUtils.uid();
    const page = await browser.newPage();
    await page.goto(URI);
    await page.setViewport({ width: 1080, height: 1024 });
    browsers.push(browser);
    console.log(`Browser started: "${browser.id}".`);
  }
}

// listen for exit signal
process.on('SIGINT', async () => {
  await killProgram();
});

// kill after max timeout
setTimeout(async () => {
  await killProgram();
}, MAX_RUNTIME);

// start
twitchAttack();
