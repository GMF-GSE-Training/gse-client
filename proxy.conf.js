const PROXY_CONFIG = {
  '/api/*': {
    target: 'http://127.0.0.1:3000',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': ''
    },
    onProxyReq: function(proxyReq, req, res) {
      console.log(`🔍 Proxy Request: ${req.method} ${req.url} -> ${proxyReq.path}`);
    },
    onError: function(err, req, res) {
      console.error('🔍 Proxy Error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Proxy error: ' + err.message);
    }
  }
};

// Function to determine if request should be proxied or handled by Angular
function shouldProxy(req) {
  const url = req.url;
  
  // Always proxy API calls
  if (url.startsWith('/api/')) {
    return true;
  }
  
  // Angular routes that should NOT be proxied (fallback to index.html)
  const angularRoutes = [
    '/dashboard',
    '/auth',
    '/login',
    '/register',
    '/password-reset',
    '/reset',
    '/verification',
    '/verify',
    '/participants',
    '/capability',
    '/cot',
    '/users',
    '/e-sign',
    '/curriculum-syllabus',
    '/home',
    '/not-found'
  ];
  
  // Check if URL starts with any Angular route
  const isAngularRoute = angularRoutes.some(route => url.startsWith(route));
  
  // Static assets should not be proxied
  const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map)$/i.test(url);
  
  // Don't proxy Angular routes and static assets
  if (isAngularRoute || isStaticAsset || url === '/' || url === '/index.html') {
    return false;
  }
  
  return false; // Default: don't proxy
}

// Custom bypass function for development server
PROXY_CONFIG.bypass = function(req, res, proxyOptions) {
  const url = req.url;
  
  console.log(`🔍 Proxy Bypass Check: ${req.method} ${url}`);
  
  // If it's not an API call, return the Angular app
  if (!shouldProxy(req)) {
    console.log(`🔍 Bypassing proxy for Angular route: ${url}`);
    return '/index.html';
  }
  
  console.log(`🔍 Proxying to backend: ${url}`);
  return null; // Continue with proxy
};

module.exports = PROXY_CONFIG;
