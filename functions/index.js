const functions = require('firebase-functions');
const puppeteer = require('puppeteer');

exports.twitchattack = functions.https.onRequest(async (request, response) => {
    // connections
    const BROWSER_COUNT = Number('1');
    const MAX_RUNTIME = Number('10000');
    const URI = String('https://www.twitch.tv/vanessabob');
    let browsers = [];

    for (let i = 0; i < BROWSER_COUNT; i++) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(URI);
      await page.setViewport({ width: 1080, height: 1024 });
      browsers.push(browser);
    }

    setTimeout(async () => {
      await Promise.all(browsers.map(async (browser) => browser.close()));
      response.send('Hello from Firebase!');
    }, MAX_RUNTIME);

    return change.after.ref.set({
      status: 'SUCCESS',
    }, { merge: true });
  });
