  test.beforeEach(async ({ browser }, testInfo: TestInfo) => {
    const userCookie = await Helpers.getUserCookie();
    page = await browser.newPage({
      baseURL: process.env.BASE_URL,
      storageState: {
        origins: [],
        cookies: [userCookie],
      },
    });
    // Listen for all console events and handle errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        // eslint-disable-next-line no-console
        console.log(`${testInfo.title}:${testInfo.line} ${msg.text()}`);
      }
    });
  });  


// ****************************** //
// *** AUTHENTICATION HELPERS *** //
// ****************************** //

/*
 * Creates user cookie for google bypass
 */
static async getUserCookie(): Promise<{
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
}> {
  const cookie = await createSession();
  // eslint-disable-next-line no-unused-vars
  const [sid, _, expires] = cookie.split(';');
  const sidValue = decodeURIComponent(sid.split('=')[1]);
  const expireValue = Math.round(new Date(expires.split('=')[1]).getTime() / 1000);

  // DOMAIN_NAME based on ENV
  return {
    name: 'connect.sid', value: sidValue, domain: process.env.DOMAIN_NAME, path: '/', expires: expireValue, httpOnly: true, secure: false, sameSite: 'Lax',
  };
}

// AXIOS UTILITY

import axios from 'axios';

export const AXIOS_INSTANCE = axios.create({ baseURL: process.env.BASE_URL, headers: { Authorization: `Basic ${process.env.LOGIN_API_TOKEN}`, 'Content-Type': 'application/json' } });
export const createSession = async () => {
  delete AXIOS_INSTANCE.defaults.headers.common.Cookie;

  const response = await AXIOS_INSTANCE.post('api/auth/auth_endpoint');
  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const [cookie] = response.headers['set-cookie'] ?? [];
  AXIOS_INSTANCE.defaults.headers.common.Cookie = cookie;

  return cookie;
};
