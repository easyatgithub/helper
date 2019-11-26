import { By, until, Builder, Key } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'https://pbank.psbc.com/perbank/';
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

      const firsrMenu = this.driver.findElement(By.id('firsrMenu'));
      await this.driver.wait(until.elementIsVisible(firsrMenu), 30000);

      const firstTab = this.driver.findElement(By.linkText('我的账户'));
      await this.driver.wait(until.elementIsVisible(firstTab), 10000).click();
      await this.driver.sleep(5000);

      await this.driver.wait(until.elementLocated(By.id('logType')), 15000).click();

      const logonId = this.driver.findElement(By.id('logonId'));
      await this.driver.wait(until.elementIsVisible(logonId), 15000).sendKeys(this.userName);
      await logonId.sendKeys(Key.TAB);

      const exitButton = this.driver.findElement(By.id('exit'));
      await this.driver.wait(until.elementIsVisible(exitButton), 150000);
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
      const sessionId = await this.driver.executeScript('return $.lily.CONFIG_SESSION_ID');

      if (sessionId && sessionId.length > 0) return sessionId;
      throw new Error('Parse session fail');
    } catch (error) {
      throw error;
    }
  }
}
