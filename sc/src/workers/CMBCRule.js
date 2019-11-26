import { By, until, Builder, Key } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';
import SocketTool from '../utils/socketTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({
        ignoreZoomSetting: true,
      })
      .forBrowser('internet explorer');
    this.bankURL = 'https://nper.cmbc.com.cn/pweb/static/login.html';
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
      const proxy = await this.socketTool.ReceiveInterceptProxyUrlFromServer(
        'CMBC',
        hostname,
        port,
      );

      RegeditTool.setProxy(`${proxy.host}:${proxy.port}`);

      await this.login();
      const cookieAndSession = await this.socketTool.getCookieAndSession();

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
      await this.driver.get(this.bankURL);

      const writeUserId = await this.driver.findElement(By.id('writeUserId'));
      await this.driver.wait(until.elementIsVisible(writeUserId), 15000).sendKeys(this.userName);
      await writeUserId.sendKeys(Key.TAB);
    } catch (error) {
      throw error;
    }
  }

  // async getCookieAndSession() {
  //   try {
  //     const cookie = await this.driver.executeScript('return document.cookie');
  //     if (!cookie || cookie.length === 0) throw new Error('get cookie failure!');
  //     return ({ cookie, session: this.parseSession(cookie) });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // parseSession(cookies) {
  //   try {
  //     const cookieArr = cookies.split(';');

  //     for (let i = 0; i < cookieArr.length; i++) {
  //       const element = cookieArr[i];
  //       if (element.toLowerCase().includes('session')) {
  //         return element.split('=')[1].split(';')[0];
  //       }
  //     }
  //     throw new Error('Parse session fail');
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
