const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', exception => {
    console.log(`Uncaught exception: "${exception}"`);
  });

  try {
    await page.goto('http://127.0.0.1:4000/footprints/', { waitUntil: 'networkidle', timeout: 10000 });
  } catch (e) {
    console.log('Got error navigating:', e.message);
  }
  await browser.close();
})();
