const {
  Key, By, until, Builder, Capabilities,
} = require('selenium-webdriver');

export default class {
  constructor(data) {
    this.driver = new Builder().withCapabilities(Capabilities.ie()).build();
    this.bankURL = data.bankURL;
    this.userName = data.userName;
    this.password = data.password;
  }

  login() {
    const _this = this;
    const driver = this.driver;

    return new Promise((async (resolve, reject) => {
      try {
        await driver.get(_this.bankURL);

        await driver.wait(until.elementLocated(By.id('customerIdText')), 15000).sendKeys(_this.userName);

        await driver.wait(until.elementLocated(By.linkText('退出')), 50000).then(async () => {
          await driver.executeScript("$(document).stopTime('mainC');");
          resolve('bank login success!');
        });
      } catch (error) {
        reject(`bank login failure! - ${error}`);
      }
    }));
  }

  getCookie() {
    const _this = this;
    const driver = this.driver;

    return new Promise((async (resolve, reject) => {
      await driver.executeScript('return document.cookie').then(async (cookies) => {
        if (cookies.length == 0 || cookies == '' || cookies == null) {
          reject('get cookies failure!');
        } else {
          const sessionId = await _this.parseSession(cookies);
          console.log(cookies, sessionId);
          resolve({ cookies, sessionId });
        }
      });
    }));
  }

  parseSession(cookies) {
    return new Promise((async (resolve, reject) => {
      const cookieArr = cookies.split(';');

      for (let i = 0; i < cookieArr.length; i++) {
        const element = cookieArr[i];
        if (element.toLowerCase().includes('session')) {
          resolve(element
            .split('=')[0]
            .replace('session_info_', '')
            .trim());
          break;
        }
      }

      reject('get session id failure!');
    }));
  }
}
