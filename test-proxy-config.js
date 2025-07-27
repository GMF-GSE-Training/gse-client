#!/usr/bin/env node

console.log('🧪 Testing Angular SPA Proxy Configuration 2025\n');

// Test 1: Proxy config syntax
console.log('1. Testing proxy.conf.js syntax...');
try {
  const proxyConfig = require('./proxy.conf.js');
  console.log('   ✅ Proxy configuration syntax is valid');
  console.log(`   ✅ Found ${Object.keys(proxyConfig).length} proxy rules`);
  
  // Check if bypass function exists
  if (typeof proxyConfig.bypass === 'function') {
    console.log('   ✅ Bypass function is defined');
  } else {
    console.log('   ⚠️  Bypass function is missing');
  }
} catch (error) {
  console.log('   ❌ Proxy configuration error:', error.message);
}

console.log();

// Test 2: Angular configuration
console.log('2. Testing angular.json configuration...');
try {
  const angularConfig = require('./angular.json');
  const serveOptions = angularConfig.projects['gse-client'].architect.serve.options;
  
  if (serveOptions.proxyConfig === 'proxy.conf.js') {
    console.log('   ✅ Angular is configured to use proxy.conf.js');
  } else {
    console.log('   ❌ Angular is not using correct proxy config file');
  }
  
  if (serveOptions.historyApiFallback) {
    console.log('   ✅ historyApiFallback is configured');
  } else {
    console.log('   ⚠️  historyApiFallback is missing');
  }
  
  if (serveOptions.host === 'localhost' && serveOptions.port === 4200) {
    console.log('   ✅ Host and port are configured correctly');
  } else {
    console.log('   ⚠️  Host/port configuration might need review');
  }
} catch (error) {
  console.log('   ❌ Angular configuration error:', error.message);
}

console.log();

// Test 3: Simulate proxy bypass logic
console.log('3. Testing proxy bypass logic...');
const testUrls = [
  // Should be bypassed (Angular routes)
  { url: '/dashboard', shouldBypass: true },
  { url: '/auth/login', shouldBypass: true },
  { url: '/participants', shouldBypass: true },
  { url: '/cot', shouldBypass: true },
  { url: '/', shouldBypass: true },
  { url: '/main.js', shouldBypass: true },
  { url: '/styles.css', shouldBypass: true },
  { url: '/favicon.ico', shouldBypass: true },
  
  // Should be proxied (API calls)
  { url: '/api/auth/login', shouldBypass: false },
  { url: '/api/participants', shouldBypass: false },
  { url: '/api/cot/list', shouldBypass: false },
];

const proxyConfig = require('./proxy.conf.js');

testUrls.forEach(({ url, shouldBypass }) => {
  const mockReq = { url };
  const result = proxyConfig.bypass(mockReq, {}, {});
  
  if (shouldBypass && result === '/index.html') {
    console.log(`   ✅ ${url} -> Bypassed to index.html (correct)`);
  } else if (!shouldBypass && result === null) {
    console.log(`   ✅ ${url} -> Proxied to backend (correct)`);
  } else {
    console.log(`   ❌ ${url} -> Unexpected behavior (got: ${result})`);
  }
});

console.log();

// Test 4: Check if old proxy.conf.json exists
console.log('4. Checking for legacy configuration...');
const fs = require('fs');
if (fs.existsSync('./proxy.conf.json')) {
  console.log('   ⚠️  Old proxy.conf.json still exists');
  console.log('   📝 Consider renaming or removing it to avoid confusion');
} else {
  console.log('   ✅ No legacy proxy.conf.json found');
}

console.log();

// Test 5: Environment service check
console.log('5. Checking environment service...');
try {
  const envServicePath = './src/app/shared/service/environment.service.ts';
  if (fs.existsSync(envServicePath)) {
    const envServiceContent = fs.readFileSync(envServicePath, 'utf8');
    if (envServiceContent.includes('/api/${endpoint}')) {
      console.log('   ✅ Environment service uses /api prefix for development');
    } else {
      console.log('   ⚠️  Environment service might not be using /api prefix');
    }
  } else {
    console.log('   ⚠️  Environment service file not found');
  }
} catch (error) {
  console.log('   ❌ Error checking environment service:', error.message);
}

console.log();
console.log('🎉 Configuration Test Complete!');
console.log();
console.log('Next steps:');
console.log('1. Start your backend server: npm run start (or equivalent)');
console.log('2. Start Angular dev server: ng serve');
console.log('3. Test browser refresh on various routes');
console.log('4. Check console for proxy logs');
console.log('5. Verify API calls work correctly');
console.log();
console.log('📚 For more details, see: docs/angular-spa-refresh-fix-2025.md');
