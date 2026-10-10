import http from 'http';

const routes = ['/', '/calculator', '/results', '/recommendations', '/methodology'];

async function checkRoute(route) {
  return new Promise((resolve) => {
    http.get(`http://localhost:5173${route}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 && data.includes('<!doctype html>')) {
          console.log(`✅ PASS: HTTP 200 for ${route} (Title/HTML payload received, length: ${data.length})`);
          resolve(true);
        } else {
          console.error(`❌ FAIL: Status ${res.statusCode} for ${route}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.error(`❌ ERROR connecting to http://localhost:5173${route}:`, err.message);
      resolve(false);
    });
  });
}

console.log('Testing Vite Dev Server Routes:');
let allPassed = true;
for (const route of routes) {
  const ok = await checkRoute(route);
  if (!ok) allPassed = false;
}

if (!allPassed) {
  process.exit(1);
} else {
  console.log('\nAll direct page routes verified with HTTP 200 OK!');
}
