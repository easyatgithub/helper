import { By, until, Builder } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'https://ibsbjstar.ccb.com.cn/CCBIS/V6/common/login.jsp';
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

      await this.driver.switchTo().frame('fQRLGIN');

      const loginElement = this.driver.findElement(By.className('login_div'));
      await this.driver.wait(until.elementIsVisible(loginElement), 10000);

      const USERID = this.driver.findElement(By.id('USERID'));
      await this.driver.wait(until.elementIsVisible(USERID), 15000).sendKeys(this.userName);

      const LOGPASS = this.driver.findElement(By.id('LOGPASS'));
      await this.driver.wait(until.elementIsVisible(LOGPASS), 15000).sendKeys(this.password);

      const loginButton = this.driver.findElement(By.id('loginButton'));
      await this.driver.wait(until.elementIsVisible(loginButton), 15000).click();

      // await this.driver.wait(until.alertIsPresent(), 10000);
      // await this.driver
      //   .switchTo()
      //   .alert()
      //   .accept();

      // await this.driver.switchTo().frame('mainfrm');

      // const SafeTypeU = this.driver.findElement(By.id('SafeTypeU'));
      // await this.driver.wait(until.elementIsVisible(SafeTypeU), 15000).click();

      // const btnNext = this.driver.findElement(By.id('btnNext'));
      // await this.driver.wait(until.elementIsVisible(btnNext), 15000).click();

      await this.driver.wait(until.elementLocated(By.linkText('退出网银')), 50000);
    } catch (error) {
      throw error;
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
