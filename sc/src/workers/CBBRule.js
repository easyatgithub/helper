import { By, Key, until, Builder } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({
        ignoreZoomSetting: true,
      })
      .forBrowser('internet explorer')
      .build();
    this.bankURL = 'http://www.cbhb.com.cn/bhbank/S101/index.htm';
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

      const loginBtn = this.driver.findElement(By.css("a[href='https://ebank.cbhb.com.cn/pWeb']"));
      await this.driver.wait(until.elementIsVisible(loginBtn), 30000).click();

      await this.driver.wait(until.elementLocated(By.name('agreement')), 30000).click();

      const LoginName = this.driver.findElement(By.id('LoginName'));
      await this.driver.wait(until.elementIsVisible(LoginName), 15000).sendKeys(this.userName);
      await LoginName.sendKeys(Key.TAB);

      // For Ukey
      // const answerInput = this.driver.wait(until.elementLocated(By.name('sub.Answer')), 150000);
      // await answerInput.click();
      // await answerInput.sendKeys('爸爸');

      return await this.driver.wait(until.elementLocated(By.id('shortcutList')), 150000);
    } catch (error) {
      // Ignore pop up dialog
      if (error.message === 'Modal dialog present') {
        return true;
      }
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
