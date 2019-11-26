import { Key, By, until, Builder } from 'selenium-webdriver';

export default class {
  constructor(data) {
    this.driver = new Builder()
      .withCapabilities({ ignoreZoomSetting: true })
      .forBrowser('internet explorer');
    this.bankURL = 'https://bank.pingan.com.cn/m/main/index.html';
    this.userName = data.userName;
    this.password = data.password;
  }

  launch() {
    this.login();
    this.getCookie();
  }

  login() {
    return new Promise(async (resolve, reject) => {
      try {
        this.driver = this.driver.build(); await this.driver.get(this.bankURL);

        await this.driver.switchTo().frame('newbankframe');

        await this.driver
          .wait(until.elementLocated(By.id('userName')), 15000)
          .sendKeys(this.userName);

        const pwordCon = this.driver.findElement(By.className('pword_con'));
        await this.driver.wait(until.elementIsVisible(pwordCon), 15000).click();

        const pikui = this.driver.findElement(By.css('.pikui-soft_switch:first-child'));
        await this.driver.wait(until.elementIsVisible(pikui), 15000).click();

        const password = this.driver.findElement(By.id('password'));
        await this.driver.wait(until.elementIsVisible(password), 15000).then(async () => {
          for (let i = 0; i < this.password.length; i++) {
            this.password.sendKeys(this.password.charAt(i));
          }
          await this.password.sendKeys(Key.TAB);
        });

        await this.driver.wait(until.elementLocated(By.linkText('安全退出')), 50000).then(() => {
          resolve('bank login success!');
        });
      } catch (error) {
        reject(`bank login failure! - ${error}`);
      }
    });
  }

  getCookie() {
    return new Promise(async (resolve, reject) => {
      await this.driver.executeScript('return document.cookie').then(async (cookies) => {
        if (cookies.length === 0 || cookies === '' || cookies === null) {
          reject('get cookies failure!');
        } else {
          const sessionId = await this.parseSession(cookies);
          resolve({ cookies, sessionId });
        }
      });
    });
  }

  parseSession(cookies) {
    return new Promise(async (resolve, reject) => {
      const cookieArr = cookies.split(';');

      for (let i = 0; i < cookieArr.length; i++) {
        const element = cookieArr[i];
        if (element.toLowerCase().includes('session')) {
          resolve(element.split('=')[1].split(';')[0]);
          break;
        }
      }

      reject('get session id failure!');
    });
  }
}
