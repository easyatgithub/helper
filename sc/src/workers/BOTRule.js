import { By, until, Builder } from 'selenium-webdriver';
import SocketTool from '../utils/socketTool';
import * as RegeditTool from '../utils/regeditTool';
import * as KeySender from '../utils/keySender';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');

    this.bankURL =
      'https://www.bankoftianjin.com/pweb/prelogin.do?LoginType=R&_locale=zh_CN';
    this.userName = data.userName;
    this.password = data.password;
    this.proxy = data.proxy;
    this.socketTool = new SocketTool();
  }

  async launch() {
    try {
      // Start
      await this.setProxy();
      await this.loginToBank();
      await this.sendUSBKey();
      await this.checkIfLoginSuccess();
      const cookieAndSession = await this.getCookie();

      return cookieAndSession;
    } catch (error) {
      throw error;
    } finally {
      RegeditTool.unsetProxy();
    }
  }

  async setProxy() {
    // Settings
    const hostname = this.proxy.split(':')[0];
    const port = +this.proxy.split(':')[1];
    const proxy = await this.socketTool.ReceiveInterceptProxyUrlFromServer(
      'BOT',
      hostname,
      port,
    );

    // RegeditTool.setIESecurityZones();
    RegeditTool.setProxy(`${proxy.host}:${proxy.port}`);
  }

  async loginToBank() {
    try {
      this.driver = this.driver.build();
      await this.driver.get(this.bankURL);

      const usernameInput = this.driver.wait(
        until.elementLocated(By.id('LoginIdOrAc')),
        150000,
      );
      await usernameInput.click();
      await usernameInput.click();
      await usernameInput.sendKeys(this.userName);
      await KeySender.sendKey(KeySender.KeyEnum.TAB);
      await KeySender.sendText('zz800525');
    } catch (error) {
      if (error.message === 'Unable to find elements on closed window') {
        throw new Error('You have close the browser');
      }
      throw new Error(`Bank login failure. Message: ${error.toString()}`);
    }
  }

  async sendUSBKey() {}

  async checkIfLoginSuccess() {}

  async getCookie() {
    const cookieAndSession = await this.socketTool.getCookieAndSession();
    return cookieAndSession;
  }
}
