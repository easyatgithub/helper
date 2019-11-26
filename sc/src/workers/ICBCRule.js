import { By, until, Builder, Key } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'https://mybank.icbc.com.cn/icbc/perbank/index.jsp';
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
    }
  }

  async login() {
    try {
      this.driver = this.driver.build(); await this.driver.get(this.bankURL);

      await this.driver.switchTo().frame('ICBC_login_frame');

      const logonCardNum = await this.driver.findElement(By.id('logonCardNum'));
      await this.driver.wait(until.elementIsVisible(logonCardNum), 15000).sendKeys(this.userName);
      await logonCardNum.sendKeys(Key.TAB);

      await this.driver.wait(until.elementLocated(By.linkText('退出')), 50000);
    } catch (error) {
      throw error;
    }
  }

  async getCookieAndSession() {
    try {
      const cookie = await this.driver.executeScript('return document.cookie');
      if (!cookie || cookie.length === 0) throw new Error('get cookie failure!');
      return { cookie, session: await this.parseSession() };
    } catch (error) {
      throw error;
    }
  }

  async parseSession() {
    try {
      return await this.driver
        .wait(until.elementLocated(By.name('dse_sessionId')), 50000)
        .getAttribute('value');
    } catch (error) {
      throw error;
    }
  }
}
