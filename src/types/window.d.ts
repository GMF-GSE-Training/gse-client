export {};

declare global {
  interface Window {
    __env?: {
      API_URL?: string;
      BACKEND_URL?: string;
      HCAPTCHA_SITEKEY?: string;
      DEV_API_URL?: string;
      DEV_PORT?: string;
      DEFAULT_DEV_API_URL?: string;
      DEFAULT_DEV_PORT?: string;
      PRODUCTION_API_URL?: string;
      DEFAULT_HCAPTCHA_SITEKEY?: string;
      [key: string]: string | undefined;
    };
    _env?: {
      BASE_URL?: string;
      HCAPTCHA_SITEKEY?: string;
      DEV_API_URL?: string;
      DEV_PORT?: string;
      [key: string]: string | undefined;
    };
  }
}