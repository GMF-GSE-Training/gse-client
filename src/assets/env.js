(function(w){w._env=w._env||{};w.__env=w.__env||{};w._env.LOCAL_URL=`http://${w.location.hostname}:3000`;w.__env.BACKEND_URL='https://dev-api.gmf-aeroasia.publicvm.com';w._env.BASE_URL=w._env.LOCAL_URL;w.__env.API_URL=w.__env.BACKEND_URL;
w._env.HCAPTCHA_SITEKEY='52bce1bc-ad8c-499c-98f4-963679f6f340';
w.__env.HCAPTCHA_SITEKEY='52bce1bc-ad8c-499c-98f4-963679f6f340';

// Debug logging
console.log('🔍 Environment Debug - BACKEND_URL:', w.__env.BACKEND_URL);
console.log('🔍 Environment Debug - API_URL:', w.__env.API_URL);
console.log('🔍 Environment Debug - BASE_URL:', w._env.BASE_URL);
console.log('🔍 Environment Debug - LOCAL_URL:', w._env.LOCAL_URL);
console.log('🔍 Environment Debug - Current Hostname:', w.location.hostname);
console.log('🔍 Environment Debug - Current Protocol:', w.location.protocol);
console.log('🔍 Environment Debug - Current Port:', w.location.port);

// Deteksi environment
const isDevelopment = w.location.hostname === 'localhost' || w.location.hostname === '127.0.0.1' || w.location.port === '4200';
console.log('🔍 Environment Debug - Is Development:', isDevelopment);
console.log('🔍 Environment Debug - Expected API URL:', isDevelopment ? '(empty - will use proxy)' : w.__env.API_URL);
})(this);