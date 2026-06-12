// Run this ONCE after unzipping: node download-photos.js
// It downloads all your Instagram photos into public/photos/

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('./data/raw/image_urls.json', 'utf8'));
const outDir = './public/photos';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function download(urlStr, dest, attempt) {
  return new Promise((resolve) => {
    try {
      const mod = urlStr.startsWith('https') ? https : http;
      const file = fs.createWriteStream(dest);
      const req = mod.get(urlStr, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
          'Referer': 'https://www.instagram.com/'
        }
      }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close(); try { fs.unlinkSync(dest); } catch(e){}
          return download(res.headers.location, dest, attempt).then(resolve);
        }
        if (res.statusCode !== 200) {
          file.close(); try { fs.unlinkSync(dest); } catch(e){}
          console.log('FAIL', dest, 'status', res.statusCode);
          return resolve(false);
        }
        res.pipe(file);
        file.on('finish', () => { file.close(); console.log('OK  ', dest); resolve(true); });
      });
      req.on('error', (e) => { try { fs.unlinkSync(dest); } catch(e2){} console.log('ERR ', dest, e.message); resolve(false); });
      req.setTimeout(20000, () => { req.destroy(); console.log('SLOW', dest); resolve(false); });
    } catch(e) { console.log('ERR', dest, e.message); resolve(false); }
  });
}

(async () => {
  console.log('Downloading', urls.length, 'photos...\n');
  let ok = 0, fail = 0;
  for (const item of urls) {
    const dest = path.join(outDir, item.name);
    const result = await download(item.url, dest);
    if (result) ok++; else fail++;
  }
  console.log('\nDone!', ok, 'downloaded,', fail, 'failed.');
  if (fail > 0) console.log('Note: a few failures are normal. The site will still work fine.');
})();
