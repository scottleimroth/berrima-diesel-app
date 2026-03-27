/**
 * Temporary exploration script to discover API endpoints used by fuel outage sites.
 * Uses Puppeteer to intercept network requests and identify JSON API endpoints.
 */
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

const TARGETS = [
  { name: 'FuelAlert.io', url: 'https://fuelalert.io/' },
  { name: 'OuttaFuel.com.au', url: 'https://outtafuel.com.au/' },
  { name: 'NoFuelHere.com.au', url: 'https://www.nofuelhere.com.au/' },
];

async function exploreSite(browser, target) {
  console.log(`\n--- Exploring: ${target.name} (${target.url}) ---`);
  const page = await browser.newPage();
  const requests = [];

  await page.setUserAgent('BerrimaDiesel-FuelTracker/1.0 (community fuel availability tool)');

  page.on('request', (req) => {
    requests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
    });
  });

  page.on('response', async (res) => {
    const contentType = res.headers()['content-type'] || '';
    if (contentType.includes('json') || contentType.includes('javascript')) {
      const req = requests.find((r) => r.url === res.url());
      if (req) {
        req.contentType = contentType;
        req.status = res.status();
        // Try to capture small JSON responses
        if (contentType.includes('json')) {
          try {
            const text = await res.text();
            req.bodyPreview = text.substring(0, 500);
          } catch (e) {
            req.bodyPreview = '(could not read body)';
          }
        }
      }
    }
  });

  try {
    await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait extra time for lazy-loaded API calls
    await new Promise((r) => setTimeout(r, 10000));
  } catch (err) {
    console.log(`  Error loading ${target.name}: ${err.message}`);
  }

  await page.close();

  // Filter to interesting requests (JSON APIs, not static assets)
  const apiRequests = requests.filter((r) => {
    const url = r.url.toLowerCase();
    // Skip common static assets
    if (url.match(/\.(css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)(\?|$)/)) return false;
    if (url.includes('google-analytics') || url.includes('gtag') || url.includes('facebook')) return false;
    if (url.includes('fonts.googleapis') || url.includes('fonts.gstatic')) return false;
    return true;
  });

  return { name: target.name, url: target.url, requests: apiRequests };
}

async function main() {
  console.log('Starting endpoint exploration...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const results = [];
  for (const target of TARGETS) {
    try {
      const result = await exploreSite(browser, target);
      results.push(result);
      console.log(`  Found ${result.requests.length} requests`);

      // Log JSON endpoints specifically
      const jsonEndpoints = result.requests.filter(
        (r) => r.contentType?.includes('json') || r.url.includes('/api/')
      );
      if (jsonEndpoints.length > 0) {
        console.log(`  JSON/API endpoints:`);
        jsonEndpoints.forEach((r) => {
          console.log(`    ${r.method} ${r.url}`);
          if (r.bodyPreview) {
            console.log(`      Preview: ${r.bodyPreview.substring(0, 200)}...`);
          }
        });
      } else {
        console.log('  No JSON/API endpoints found');
      }
    } catch (err) {
      console.log(`  Failed to explore ${target.name}: ${err.message}`);
      results.push({ name: target.name, url: target.url, requests: [], error: err.message });
    }

    // Random delay between sites
    await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
  }

  await browser.close();

  // Write results to file for analysis
  const outputPath = path.join(__dirname, 'endpoint-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${outputPath}`);
}

main().catch(console.error);
