import { By, until, Builder, Key } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'http://eweb.ahrcu.com/CN/index.html';
    this.userName = data.userName;
    this.password = data.password;
    this.proxy = data.proxy;
  }

  async launch() {
    try {
      // RegeditTool.setIESecurityZones();
      RegeditTool.setProxy(this.proxy);
      await this.login();
      const cookieAndSession = await this.getCookieAndSession();

      return cookieAndSession;
    } catch (error) {
      throw new Error(error);
    } finally {
      RegeditTool.unsetProxy();
    }
  }

  async login() {
    try {
      this.driver = this.driver.build(); await this.driver.get(this.bankURL);

      await this.driver
        .navigate()
        .to('https://ebank.ahrcu.com:8443/pweb/prelogin.do?LoginType=C&_locale=zh_CN&BankId=9999');

      await this.driver
        .wait(until.elementLocated(By.name('UserId')), 15000)
        .sendKeys(this.userName);

      const userId = this.driver.findElement(By.name('UserId'));
      await userId.sendKeys(Key.TAB);
      await this.driver.wait(until.elementIsNotVisible(userId), 150000);
    } catch (error) {
      throw error;
    }
  }

  async getCookieAndSession() {
    try {
      const cookie = await this.driver.executeScript('return document.cookie');
      if (!cookie || cookie.length === 0) throw new Error('get cookie failure!');
      return { cookie, session: this.parseSession(cookie) };
    } catch (error) {
      throw error;
    }
  }

  parseSession(cookies) {
    const cookieArr = cookies.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
      const element = cookieArr[i];
      if (element.toLowerCase().includes('session')) {
        return element.split('=')[1].split(';')[0];
      }
    }
    return null;
  }
}
