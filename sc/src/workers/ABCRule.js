import { By, until, Builder } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'https://perbank.abchina.com/EbankSite/startup.do';
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
      this.driver = this.driver.build();
      this.driver = this.driver.build(); await this.driver.get(this.bankURL);

      const usernameInput = this.driver.wait(until.elementLocated(By.id('userNamebtn')), 150000);
      await usernameInput.click();

      await this.driver.wait(until.elementLocated(By.id('contentFrame')), 150000);
    } catch (error) {
      throw new Error(`bank login failure!- ${error}`);
    }
  }

  async getCookieAndSession() {
    try {
      const cookie = await this.driver.executeScript('return document.cookie');
      if (!cookie || cookie.length === 0) throw new Error('get cookie failure!');
      return { cookie, session: null };
    } catch (error) {
      throw error;
    }
  }
}
