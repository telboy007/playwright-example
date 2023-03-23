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

  // DOMAIN_NAME 
  return {
    name: 'connect.sid', value: sidValue, domain: process.env.DOMAIN_NAME, path: '/', expires: expireValue, httpOnly: true, secure: false, sameSite: 'Lax',
  };
}
