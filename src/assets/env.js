// =============================
//  ENV.JS - PANDUAN PENGISIAN & DEFAULT
// =============================
//
// 1. Default (boleh diubah sesuai kebutuhan, akan dipakai jika tidak override):
//    window.__env = {
//      DEFAULT_DEV_API_URL: 'http://localhost:3000',
//      DEFAULT_DEV_PORT: '4200',
//      PRODUCTION_API_URL: 'https://dev-api.gmf-aeroasia.publicvm.com',
//      DEFAULT_HCAPTCHA_SITEKEY: '52bce1bc-ad8c-499c-98f4-963679f6f340',
//      // Custom override (opsional)
//      DEV_API_URL: '', // override jika perlu
//      DEV_PORT: '',    // override jika perlu
//      API_URL: '',     // kosongkan untuk dev/proxy, isi untuk production
//      HCAPTCHA_SITEKEY: ''
//    };
//
// 2. Untuk DEVELOPMENT (localhost, 127.0.0.1, 0.0.0.0, atau IP LAN):
//    - DEV_API_URL: URL backend API (bisa http://localhost:3000, http://192.168.1.100:3000, dll)
//    - DEV_PORT: Port frontend (misal '4200', '8080', dst)
//
// 3. Untuk PRODUCTION (domain publik atau IP internal):
//    - API_URL: URL backend API (bisa https://api.production.com atau http://10.10.10.10:3000)
//    - HCAPTCHA_SITEKEY: Kunci hcaptcha (jika ada)
//
// 4. Tidak perlu mengubah bagian bawah file ini kecuali ada kebutuhan khusus.
//    Semua deteksi dan fallback sudah otomatis.
//
// 5. Untuk update runtime (tanpa rebuild):
//    window.updateDevConfig('http://192.168.1.101:3000', '8080');
//    window.updateProductionDomain('http://10.10.10.20:3000');
// =============================

(function(w){
  w._env = w._env || {};
  w.__env = w.__env || {
    DEFAULT_DEV_API_URL: 'http://localhost:3000',
    DEFAULT_DEV_PORT: '4200',
    PRODUCTION_API_URL: 'https://dev-api.gmf-aeroasia.publicvm.com',
    DEFAULT_HCAPTCHA_SITEKEY: '52bce1bc-ad8c-499c-98f4-963679f6f340',
    DEV_API_URL: '',
    DEV_PORT: '',
    API_URL: '',
    HCAPTCHA_SITEKEY: ''
  };

  const DEVELOPMENT_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0'];
  const DEVELOPMENT_PORTS = ['4200', '3000', '8080', '8000', '9000', '4000', '5000'];
  const PRODUCTION_DOMAINS = ['gmf-aeroasia.publicvm.com', 'gmf-aeroasia.com'];

  function isLocalNetworkAddress(hostname) {
    const localNetworkPatterns = [
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./
    ];
    return localNetworkPatterns.some(pattern => pattern.test(hostname));
  }

  const isDevelopment = DEVELOPMENT_HOSTNAMES.includes(w.location.hostname) ||
                       DEVELOPMENT_PORTS.includes(w.location.port) ||
                       isLocalNetworkAddress(w.location.hostname);
  const isProduction = PRODUCTION_DOMAINS.some(domain => w.location.hostname.includes(domain));
  const isSecure = w.location.protocol === 'https:' || isDevelopment;

  // Environment-specific configuration
  if (isDevelopment) {
    w._env.LOCAL_URL = `${w.location.protocol}//${w.location.hostname}:${w.location.port}`;
    w._env.BASE_URL = w._env.LOCAL_URL;
    // Development API URL - prioritas: override > default
    const devApiUrl = w.__env.DEV_API_URL || w.__env.DEFAULT_DEV_API_URL;
    w.__env.API_URL = '';
    w.__env.BACKEND_URL = devApiUrl;
    w.__env.DEV_API_URL = devApiUrl;
    // Development port
    const devPort = w.__env.DEV_PORT || w.__env.DEFAULT_DEV_PORT;
    w.__env.DEV_PORT = devPort;
    w._env.DEV_PORT = devPort;
    console.log('🔍 Environment: Development mode detected', {
      hostname: w.location.hostname,
      port: w.location.port,
      devApiUrl,
      devPort,
      usingProxy: w.__env.API_URL === ''
    });
  } else {
    w._env.LOCAL_URL = `https://${w.location.hostname}`;
    w._env.BASE_URL = w._env.LOCAL_URL;
    // Production API URL - prioritas: override > default
    const prodApiUrl = w.__env.API_URL || w.__env.PRODUCTION_API_URL;
    w.__env.API_URL = prodApiUrl;
    w.__env.BACKEND_URL = prodApiUrl;
    console.log('🔍 Environment: Production mode detected', {
      hostname: w.location.hostname,
      port: w.location.port,
      apiUrl: w.__env.API_URL
    });
  }

  // Shared configuration
  w._env.HCAPTCHA_SITEKEY = w.__env.HCAPTCHA_SITEKEY || w.__env.DEFAULT_HCAPTCHA_SITEKEY;
  w.__env.HCAPTCHA_SITEKEY = w._env.HCAPTCHA_SITEKEY;

  // Debug logging
  console.log('🔍 Environment Configuration 2025:', {
    hostname: w.location.hostname,
    port: w.location.port,
    protocol: w.location.protocol,
    isDevelopment,
    isProduction,
    isSecure,
    isLocalNetwork: isLocalNetworkAddress(w.location.hostname),
    LOCAL_URL: w._env.LOCAL_URL,
    BASE_URL: w._env.BASE_URL,
    API_URL: w.__env.API_URL,
    BACKEND_URL: w.__env.BACKEND_URL,
    DEV_API_URL: w.__env.DEV_API_URL,
    DEV_PORT: w.__env.DEV_PORT,
    PRODUCTION_API_URL: w.__env.PRODUCTION_API_URL,
    DEFAULT_DEV_API_URL: w.__env.DEFAULT_DEV_API_URL,
    DEFAULT_DEV_PORT: w.__env.DEFAULT_DEV_PORT,
    DEFAULT_HCAPTCHA_SITEKEY: '***',
    DEVELOPMENT_HOSTNAMES,
    DEVELOPMENT_PORTS,
    PRODUCTION_DOMAINS,
    HCAPTCHA_SITEKEY: w.__env.HCAPTCHA_SITEKEY ? '***' : 'not set',
    _env: w._env,
    __env: w.__env
  });

  // Validation
  const validateEnvironment = () => {
    const issues = [];
    if (!w.__env.API_URL && !isDevelopment) {
      issues.push('API_URL not set for production');
    }
    if (!w.__env.HCAPTCHA_SITEKEY) {
      issues.push('HCAPTCHA_SITEKEY not set');
    }
    if (!isSecure && isProduction) {
      issues.push('Production not using HTTPS');
    }
    if (isDevelopment && !w.__env.DEV_API_URL && !w.__env.DEFAULT_DEV_API_URL) {
      issues.push('DEV_API_URL/DEFAULT_DEV_API_URL not set for development');
    }
    if (issues.length > 0) {
      console.warn('🔍 Environment Validation Issues:', issues);
    } else {
      console.log('🔍 Environment validation passed');
    }
    return issues.length === 0;
  };
  validateEnvironment();

  // Export info
  w.GMF_ENV_INFO = {
    isDevelopment,
    isProduction,
    isSecure,
    isLocalNetwork: isLocalNetworkAddress(w.location.hostname),
    apiUrl: w.__env.API_URL,
    backendUrl: w.__env.BACKEND_URL,
    devApiUrl: w.__env.DEV_API_URL,
    devPort: w.__env.DEV_PORT,
    productionApiUrl: w.__env.PRODUCTION_API_URL,
    defaultDevApiUrl: w.__env.DEFAULT_DEV_API_URL,
    defaultDevPort: w.__env.DEFAULT_DEV_PORT,
    defaultHcaptchaSiteKey: w.__env.DEFAULT_HCAPTCHA_SITEKEY,
    developmentHostnames: DEVELOPMENT_HOSTNAMES,
    developmentPorts: DEVELOPMENT_PORTS,
    productionDomains: PRODUCTION_DOMAINS,
    timestamp: new Date().toISOString()
  };

  // Runtime update methods
  w.updateProductionDomain = function(newDomain) {
    w.__env.API_URL = newDomain;
    w.__env.BACKEND_URL = newDomain;
    w.__env.PRODUCTION_API_URL = newDomain;
    w.GMF_ENV_INFO.productionApiUrl = newDomain;
    w.GMF_ENV_INFO.apiUrl = newDomain;
    w.GMF_ENV_INFO.backendUrl = newDomain;
    w.GMF_ENV_INFO.timestamp = new Date().toISOString();
    console.log('🔍 Environment: Production domain updated successfully at runtime');
  };
  w.updateDevConfig = function(devApiUrl, devPort) {
    if (devApiUrl) {
      w.__env.DEV_API_URL = devApiUrl;
      w.__env.BACKEND_URL = devApiUrl;
      w.__env.DEFAULT_DEV_API_URL = devApiUrl;
      w.GMF_ENV_INFO.devApiUrl = devApiUrl;
      w.GMF_ENV_INFO.defaultDevApiUrl = devApiUrl;
    }
    if (devPort) {
      w.__env.DEV_PORT = devPort;
      w.__env.DEFAULT_DEV_PORT = devPort;
      w.GMF_ENV_INFO.devPort = devPort;
      w.GMF_ENV_INFO.defaultDevPort = devPort;
    }
    w.GMF_ENV_INFO.timestamp = new Date().toISOString();
    console.log('🔍 Environment: Development configuration updated successfully at runtime');
  };
})(this);