import { By, until } from "selenium-webdriver";
import * as KeySender from "./utils/keySender";
import {
  executeJavaScript,
  waitPageLoad,
  getElementValue,
  waitUtilGetText,
  sendKeys,
} from "./utils/seleniumHelper";
import {
  getCurrentCardDetail,
  getSelectedTaskDetail,
  setBankBalance,
  setLog,
} from "./utils/storeHelper";
import { OperationalError } from "./utils/workerErrorHandler";
import * as regexHelper from "./utils/regexHelper";
export default class {
  constructor() {
    this.driver = null;
    this.bankURL = "https://perbank.abchina.com/EbankSite/startup.do";
    this.card = getCurrentCardDetail();
    this.task = "";
    this.bankMapppingList = {
      中国工商银行: "中国工商银行 ",
      中国农业银行: "中国农业银行",
      中国银行: "中国银行",
      中国建设银行: "中国建设银行",
      中国邮政储蓄银行: "中国邮政储蓄银行",
      招商银行: "招商银行",
      中信银行: "中信银行",
      民生银行: "中国民生银行",
      兴业银行: "兴业银行",
      浦东发展银行: "浦东发展银行",
      光大银行: "中国光大银行",
      平安银行: "平安银行",
      华夏银行: "华夏银行",
      广发银行: "广发银行",
      北京银行: "北京银行",
      上海银行: "上海银行",
      江苏银行股份有限公司: "江苏银行股份有限公司",
      恒丰银行: "恒丰银行",
      浙商银行: "浙商银行",
      南京银行: "南京银行",
    };
  }

  async launchSelenium() {
    try {
      await this.driver.get(this.bankURL);
    } catch (error) {
      throw error;
    }
  }

  async loginToBank() {
    try {
      await this.driver.wait(until.elementLocated(By.id("PowerEnterDiv_powerpass_2")), 20 * 1000);
      await executeJavaScript(
        this.driver,
        "focus passwprd box ",
        "document.getElementById('PowerEnterDiv_powerpass_2').focus();",
        0,
      );

      await KeySender.sendText(this.card.usbPassword, 3 * 1000);
      await KeySender.sendKey(KeySender.KeyEnum.RETURN, 2 * 1000);
    } catch (error) {
      throw error;
    }
  }

  async sendUSBKey() {}

  /**
   *
   * @param {Object} globalState
   * @param {Boolean} globalStore.isManualLogin
   */
  async checkIfLoginSuccess(globalState) {
    try {
      const element = until.elementLocated(By.id("contentFrame"));
      if (globalState.isManualLogin) {
        await this.driver.wait(element, 5 * 1000);
      } else {
        await this.driver.wait(element, 30 * 1000);
        await waitPageLoad(this.driver);
      }
    } catch (error) {
      throw error;
    }
  }

  async getCookie() {
    try {
      const cookie = await this.driver.executeScript("return document.cookie");
      if (!cookie || cookie.length === 0) throw new Error("get cookie failure!");
      return { cookie, session: null };
    } catch (error) {
      throw error;
    }
  }

  async goTransferPage() {
    try {
      //await KeySender.sendKey(KeySender.KeyEnum["ALT+TAB"], 1 * 1000);
      await executeJavaScript(
        this.driver,
        "change page ",
        "document.querySelector('#menuNav>ul>li').click()",
        0,
      );
      await executeJavaScript(
        this.driver,
        "change page ",
        "document.getElementById('menuNav').getElementsByTagName('li')[12].getElementsByTagName('ul')[0].getElementsByTagName('li')[0].click()",
        500,
      );
      // This wait until transfer page load
      await this.driver.wait(until.elementLocated(By.id("contentFrame")), 60 * 1000);
      // Switch to iframe
      await this.driver.switchTo().frame("contentFrame");
      await this.driver.wait(
        until.elementIsVisible(
          await this.driver.wait(until.elementLocated(By.id("fromAcctBalance")), 20 * 1000),
        ),
        20 * 1000,
      );
      await this.driver.wait(
        until.elementIsVisible(
          await this.driver.wait(until.elementLocated(By.id("toAcctNo")), 20 * 1000),
        ),
        20 * 1000,
      );
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }

  async fillTransferFrom() {
    try {
      this.task = getSelectedTaskDetail();

      await this.driver.switchTo().frame("contentFrame");

      // account
      await sendKeys(this.driver.wait(until.elementLocated(By.id("toAcctNo"), 5 * 1000)), {
        text: this.task.bank.cardNumber,
      });

      // name
      await sendKeys(this.driver.wait(until.elementLocated(By.id("toAcctNameKey"), 5 * 1000)), {
        text: this.task.receiverName,
      });

      // amount
      await sendKeys(this.driver.wait(until.elementLocated(By.id("transAmt"), 5 * 1000)), {
        text: Number.parseFloat(this.task.requestAmount).toFixed(2),
        replaceRule: /\,/g,
      });

      await this.waitUntilBankSelected();
      // submit
      await executeJavaScript(
        this.driver,
        "click submit button",
        "document.getElementById('transferNext').click()",
        0,
      );
      await this.driver.wait(until.elementLocated(By.id("agreeBtn"), 30 * 1000));
      await this.checkSubmitedValue();
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }

  async waitUntilBankSelected() {
    var retryTimes = 3;
    while (retryTimes >= 0) {
      try {
        if (retryTimes === 0) {
          const errorMessage = "wait until bank selected fail";
          setLog({
            level: "error",
            message: errorMessage,
          });
          throw new Error(errorMessage);
        }
        var bankField = this.driver.wait(until.elementLocated(By.id("bankKey")), 100);
        var isBankSelected = await getElementValue(bankField);
        // this field  have value mean choose bank successful
        if (isBankSelected.trim()) {
          setLog({ level: "info", message: "Bank selected success" });
          break;
        }
        var bankName = this.bankMapppingList[this.task.bank.chineseName];

        await sendKeys(bankField, { text: bankName });
        await executeJavaScript(
          this.driver,
          "choose bank",
          "if(document.querySelectorAll('#bankRst>table>tbody>tr>td').length)  document.querySelector('#bankRst>table>tbody>tr>td').click()",
          0,
        );
        await this.driver.sleep(100);
      } catch (error) {
        if (error.name === "OperationalError" || error.name === "JavascriptError") {
          setLog({
            level: "warn",
            message: `wait until bank selected fail, ${retryTimes} times, Error: ${error}`,
          });
          continue;
        }
        throw error;
      } finally {
        retryTimes--;
      }
    }
  }

  // 检测页面最终获得的值 大多数第3行是金额 有时第三行是 实时转账
  async checkSubmitedValue() {
    var nameCardLine = await this.driver
      .findElement(By.css("table.table.table-centre>tbody>tr:nth-child(2)>td:nth-child(2)"))
      .getText();

    var thirdLine = await this.driver
      .findElement(By.css("table.table.table-centre>tbody>tr:nth-child(3)>td:nth-child(2)"))
      .getText();
    var amountLine = thirdLine;
    if (thirdLine.indexOf("实时") > -1) {
      amountLine = await this.driver
        .findElement(By.css("table.table.table-centre>tbody>tr:nth-child(4)>td:nth-child(2)"))
        .getText();
    }

    var amount = amountLine.replace(/[^0-9.]/gi, "").trim();
    amount = amount.replace(/,/g, "");
    if (parseFloat(amount) != parseFloat(this.task.requestAmount)) {
      throw new Error("Amount is not right!");
    }

    var name = nameCardLine.split("/")[0];
    if (name != this.task.receiverName) {
      throw new Error("Receiver name is not right!");
    }

    var card = nameCardLine.split("/")[1];
    if (card != this.task.bank.cardNumber) {
      throw new Error("Card number is not right!");
    }
  }

  async fillNote() {}

  async confirmTransaction() {
    try {
      await this.driver.switchTo().frame("contentFrame");

      await this.driver.wait(until.elementLocated(By.id("agreeBtn")));
      // This for focus password field
      //await this.driver.executeScript("$('#agreeBtn').click()");
      await KeySender.sendText(this.card.queryPassword);
      await KeySender.sendKey(KeySender.KeyEnum.RETURN);

      // This to check if show the confirm message box
      await this.sendUSBPasswordToTransfer();

      await this.waitUsbPress();
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }

  async sendUSBPasswordToTransfer() {
    try {
      // Check if need to confirm
      await this.driver.wait(until.elementLocated(By.id("popupbox-confirm-0")), 3 * 1000);

      // If yes, focuse password field again
      await this.driver.executeScript("document.getElementById('powerpass_ie').focus()");

      // Press enter to send usb password
      await KeySender.sendKey(KeySender.KeyEnum.RETURN);

      // Send usb password
      await KeySender.sendText(this.card.usbPassword);
      await KeySender.sendKey(KeySender.KeyEnum.RETURN);
    } catch (error) {
      // If no need to confirm
      await KeySender.sendText(this.card.usbPassword);
      await KeySender.sendKey(KeySender.KeyEnum.RETURN);
      return;
    }
    setLog({
      level: "info",
      message: "Send USB password success",
    });
  }

  // async waitUsbPress() {
  //   var retryTimes = 20;
  //   while (retryTimes >= 0) {
  //     try {
  //       retryTimes--;
  //       await this.driver.sleep(3 * 1000);
  //       // this wait 10 sec it because we need to wait the success page
  //       var message = await this.driver.wait(until.elementLocated(By.id("trnTips")), 10 * 1000);

  //       if (message) {
  //         setLog({ level: "info", message: "USB pressed" });
  //         break;
  //       }

  //       if (retryTimes === 0)
  //         throw new OperationalError("USB didn't press, please restart the task");
  //     } catch (error) {
  //       if (error.name === "UnexpectedAlertOpenError") {
  //         setLog({
  //           level: "warn",
  //           message: `Waiting for usb press, remaining times: ${retryTimes}`,
  //         });
  //       } else if (error.name === "OperationalError") {
  //         setLog({ level: "error", message: error.message });
  //         throw error;
  //       } else if (error.name === "TimeoutError") {
  //         setLog({ level: "warning", message: "Can't get the element 'trnTips'" });
  //         break;
  //       } else throw error;
  //     }
  //   }
  // }

  async checkIfSuccess() {
    try {
      await this.driver.switchTo().frame("contentFrame");

      return Promise.race([
        this.waitTransferMessage(),
        this.waitSuccessMessage(),
        new Promise((_, reject) => setTimeout(reject, 10 * 1000)),
      ])
        .then(() => true)
        .catch(() => false);
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }

  // 您已成功转账111.00元给黄川林(6226632702402632)
  waitTransferMessage() {
    return new Promise(async resolve => {
      var trnTips = await this.driver
        .wait(until.elementLocated(By.id("trnTips")), 15 * 1000)
        .getText();
      if (
        trnTips.indexOf(this.task.card.number) !== -1 &&
        trnTips.indexOf(this.task.amount) !== -1
      ) {
        return resolve();
      }
    });
  }

  // 资金已成功转入收款银行
  waitSuccessMessage() {
    return new Promise(async resolve => {
      var trnTips = await this.driver
        .wait(until.elementLocated(By.id("trnTips")), 15 * 1000)
        .getText();
      if (trnTips.indexOf("成功") !== -1) return resolve();
    });
  }

  async getBalance() {
    try {
      await this.driver.executeScript(
        "document.getElementById('menuNav').getElementsByTagName('li')[0].click()",
      );
      await this.driver.sleep(3 * 1000);

      await this.driver.switchTo().frame("contentFrame");

      var balance = await waitUtilGetText(this.driver, until.elementLocated(By.id("dnormal")));

      setBankBalance(balance);
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }
}
