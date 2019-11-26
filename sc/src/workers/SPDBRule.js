import { By, until, Builder } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'https://ebank.spdb.com.cn/nbper/prelogin.do';
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

      await this.driver.switchTo().frame('login-iframe');

      const LoginId = await this.driver.findElement(By.id('LoginId'));
      await this.driver.wait(until.elementIsVisible(LoginId), 30000).sendKeys(this.userName);

      await this.driver.wait(until.elementLocated(By.linkText('安全退出')), 50000);
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
    try {
      const cookieArr = cookies.split(';');

      for (let i = 0; i < cookieArr.length; i++) {
        const element = cookieArr[i];
        if (element.toLowerCase().includes('session')) {
          return element.split('=')[1].split(';')[0];
        }
      }
      throw new Error('Parse session fail');
    } catch (error) {
      throw error;
    }
  }
}
