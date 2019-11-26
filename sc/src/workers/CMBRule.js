import { By, until, Builder } from 'selenium-webdriver';
import * as RegeditTool from '../utils/regeditTool';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL =
      'https://pbsz.ebank.cmbchina.com/CmbBank_GenShell/UI/GenShellPC/Login/Login.aspx';
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

      const goPassWordLogin = this.driver.wait(
        until.elementLocated(By.id('goPassWordLogin')),
        15000,
      );
      await goPassWordLogin.click();

      const usernameInput = this.driver.wait(
        until.elementLocated(By.id('UniLoginUser_Ctrl')),
        15000,
      );
      await usernameInput.click();
      await usernameInput.sendKeys(this.userName);

      await this.driver.wait(until.elementLocated(By.id('btnSendCode')), 15000).click();

      await this.driver.wait(until.elementLocated(By.linkText('退出')), 300000);
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

  async parseSession() {
    try {
      return await this.driver
        .wait(until.elementLocated(By.id('ClientNo')), 50000)
        .getAttribute('value');
    } catch (error) {
      throw error;
    }
  }
}
