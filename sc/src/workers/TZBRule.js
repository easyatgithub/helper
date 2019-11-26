import { By, until, Builder } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';
import SocketTool from '../utils/socketTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL =
      'https://ebank.tzbank.com/pweb/prelogin.do?_locale=zh_CN&BankId=04590501&LoginType=C';
    this.userName = data.userName;
    this.password = data.password;
    this.proxy = data.proxy;
    this.socketTool = new SocketTool();
  }

  async launch() {
    try {
      // Settings
      const hostname = this.proxy.split(':')[0];
      const port = +this.proxy.split(':')[1];
      const proxy = await this.socketTool.ReceiveInterceptProxyUrlFromServer('TZB', hostname, port);

      // RegeditTool.setIESecurityZones();
      RegeditTool.setProxy(`${proxy.host}:${proxy.port}`);

      // Start
      await this.login();
      const cookieAndSession = await this.socketTool.getCookieAndSession();

      this.driver.close();
      return cookieAndSession;
    } catch (error) {
      throw error;
    } finally {
      // Release source
      RegeditTool.unsetProxy();
    }
  }

  async login() {
    try {
      this.driver = this.driver.build(); await this.driver.get(this.bankURL);

      const loginButton = this.driver.wait(until.elementLocated(By.className('Sign_in')), 150000);
      await loginButton.click();
      const usernameInput = this.driver.wait(until.elementLocated(By.id('LoginIdOrAc')), 150000);
      await usernameInput.click();
      return await usernameInput.sendKeys(this.userName);
    } catch (error) {
      // Ignore pop up dialog
      if (error.message === 'Modal dialog present') {
        return true;
      }
      if (error.message === 'Unable to find elements on closed window') {
        throw new Error('You have close the browser');
      }
      throw new Error(`Bank login failure. Message: ${error.toString()}`);
    }
  }
}
