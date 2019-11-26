import { ThenableWebDriver } from "selenium-webdriver";
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
    /** @type { ThenableWebDriver } */
    this.driver = null;
    this.bankURL = "https://mybank.icbc.com.cn/icbc/newperbank/perbank3/frame/frame_index.jsp";
    this.card = getCurrentCardDetail();
    this.task = "";
    this.bankMapppingList = {
      中国工商银行: "setBankInfo(102,'中国工商银行')",
      中国农业银行: "setBankInfo(103,'中国农业银行')",
      中国银行: "setBankInfo(104,'中国银行')",
      中国建设银行: "setBankInfo(105,'中国建设银行')",
      交通银行: "setBankInfo(301,'交通银行')",

      中信银行: "setBankInfo(302,'中信银行')",
      光大银行: "setBankInfo(303,'中国光大银行')",
      华夏银行: "setBankInfo(304,'华夏银行')",
      民生银行: "setBankInfo(305,'中国民生银行')",
      广发银行: "setBankInfo(306,'广发银行')",

      平安银行: "setBankInfo(307,'平安银行')",
      招商银行: "setBankInfo(308,'招商银行')",
      兴业银行: "setBankInfo(309,'兴业银行')",
      浦东发展银行: "setBankInfo(310,'上海浦东发展银行')",
      城市商业银行: "setBankInfo(313,'城市商业银行')",

      农村商业银行: "setBankInfo(314,'农村商业银行')",
      恒丰银行: "setBankInfo(315,'恒丰银行')",
      浙商银行: "setBankInfo(316,'浙商银行')",
      渤海银行: "setBankInfo(318,'渤海银行')",
      中国邮政储蓄银行: "setBankInfo(403,'邮储银行')",
      北京银行: "setBankInfo(313,'北京银行')",
    };
  }

  async launchSelenium() {
    try {
      await this.driver.get(this.bankURL);
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginToBank() {
    try {
      // TODO
      await this.driver.switchTo().frame("ICBC_login_frame");
      await this.driver.wait(until.elementLocated(By.id("logonCardNum")), 20 * 1000);
      await executeJavaScript(
        this.driver,
        "fill account name",
        `document.getElementById('logonCardNum').value ='${this.card.accountName}'`,
      );
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }

  /**
   *
   * @param {Object} globalState
   * @param {Boolean} globalStore.isManualLogin
   */
  async checkIfLoginSuccess(globalState) {
    try {
      const element = until.elementLocated(By.linkText("退出"));
      if (globalState.isManualLogin) {
        await this.driver.wait(element, 5 * 1000);
      } else {
        await this.driver.wait(element, 120 * 1000);
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
      await executeJavaScript(
        this.driver,
        "跳转到转账页面",
        "document.querySelector('#commonUseTbl > ul > li:nth-child(3)').click();",
        0,
      );
      await this.driver.sleep(3 * 1000);
      await this.enterFirstFrame();
      await this.enterSecondFrame();
      // 在内层等待 付款卡号显示 页面慢时 有loadding 挡住这个元素
      await waitPageLoad(this.driver);
      await this.driver.wait(
        until.elementIsVisible(this.driver.findElement(By.id("payCardListShow"))),
        15 * 1000,
      );
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }

  async enterFirstFrame() {
    var retryTimes = 15;

    while (retryTimes >= 0) {
      try {
        if (retryTimes === 0) {
          const errorMessage = "Trying enter first iframe fail";
          setLog({
            level: "error",
            message: errorMessage,
          });
          throw new Error(errorMessage);
        }
        await this.driver.wait(until.elementLocated(By.id("perbank-content-frame")), 30 * 1000);
        await this.driver.switchTo().frame("perbank-content-frame");

        const text = await this.driver
          .wait(until.elementLocated(By.id("mytranname")), 1 * 1000)
          .getText();
        if (text === "汇款 > 转账汇款 > 境内汇款") {
          setLog({ level: "info", message: "First Iframe entered" });
          break;
        }
      } catch (error) {
        if (error.name === "JavascriptError" || error.name === "TimeoutError") {
          setLog({
            level: "warn",
            message: `Enter first frame fail, ${retryTimes} times, Error: ${error}`,
          });
          continue;
        }
        throw error;
      } finally {
        retryTimes--;
        await this.driver.switchTo().defaultContent();
      }
    }
  }

  async enterSecondFrame() {
    var retryTimes = 15;

    while (retryTimes >= 0) {
      try {
        if (retryTimes === 0) {
          const errorMessage = "Trying enter second iframe fail";
          setLog({
            level: "error",
            message: errorMessage,
          });
          throw new Error(errorMessage);
        }
        await this.driver.wait(until.elementLocated(By.id("perbank-content-frame")), 10 * 1000);
        await this.driver.switchTo().frame("perbank-content-frame");

        await this.driver.wait(until.elementLocated(By.id("content-frame")), 10 * 1000);
        await this.driver.switchTo().frame("content-frame");

        const element = await this.driver.wait(
          until.elementLocated(By.id("remitAmtInput")),
          15 * 1000,
        );

        if (element) {
          setLog({ level: "info", message: "Second iframe entered" });
          break;
        }
        await this.driver.sleep(1000);
      } catch (error) {
        if (
          error.name === "JavascriptError" ||
          error.name === "TimeoutError" ||
          error.name === "NoSuchElementError"
        ) {
          setLog({
            level: "warn",
            message: `Enter second frame fail, ${retryTimes} times, Error: ${error}`,
          });
          await this.driver.switchTo().defaultContent();
          continue;
        }
        throw error;
      } finally {
        retryTimes--;
      }
    }
  }

  async fillTransferFrom() {
    try {
      this.task = getSelectedTaskDetail();
      // Switch to iframe
      await this.driver.wait(until.elementLocated(By.id("perbank-content-frame")), 10 * 1000);
      this.driver.switchTo().frame("perbank-content-frame");

      await this.driver.wait(until.elementLocated(By.id("content-frame")), 10 * 1000);
      this.driver.switchTo().frame("content-frame");

      await this.driver.wait(until.elementLocated(By.id("bankListShow")), 10 * 1000);
      await this.driver.sleep(1000);

      // name
      await sendKeys(this.driver.wait(until.elementLocated(By.id("recNameShow"), 5 * 1000)), {
        text: this.task.receiverName,
      });
      // amount
      await sendKeys(this.driver.wait(until.elementLocated(By.id("remitAmtInput"), 5 * 1000)), {
        text: Number.parseFloat(this.task.requestAmount).toFixed(2),
        replaceRule: /\,/g,
      });

      await executeJavaScript(
        this.driver,
        "执行页面js 设置银行",
        this.bankMapppingList[this.task.bank.chineseName],
        0,
      );
      await this.waitUntilBankSelected();
      await this.waitUntilNameFilled();
      await executeJavaScript(
        this.driver,
        "提交表单",
        "document.getElementById('tijiao').click()",
        500,
      );
      await this.driver.wait(until.elementLocated(By.id("queren"), 10 * 1000));
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
        await executeJavaScript(
          this.driver,
          "fill card number",
          `document.getElementById('recAcctShow').value ='${this.task.bank.cardNumber}'`,
          0,
        );
        await executeJavaScript(
          this.driver,
          "focus card number",
          "document.getElementById('recAcctShow').focus()",
        );
        var bankField = this.driver.wait(until.elementLocated(By.id("bankListShow")), 1000);
        var selectedBank = await getElementValue(bankField);

        if (selectedBank.length > 0) {
          setLog({ level: "info", message: "wait until bank selected success" });
          break;
        }
      } catch (error) {
        if (error.name === "JavascriptError" || error.name === "TimeoutError") {
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

  async waitUntilNameFilled() {
    var retryTimes = 5;
    while (retryTimes >= 0) {
      try {
        if (retryTimes === 0) {
          const errorMessage = "wait until name filled faill";
          setLog({
            level: "error",
            message: errorMessage,
          });
          throw new Error(errorMessage);
        }
        var nameField = this.driver.wait(until.elementLocated(By.id("recNameShow")), 100);
        var name = await getElementValue(nameField);

        if (name === this.task.receiverName) {
          setLog({ level: "info", message: "wait until name filled success" });
          break;
        }
        await executeJavaScript(
          this.driver,
          "fill receiverName",
          `document.getElementById('recNameShow').value ='${this.task.receiverName}'`,
          0,
        );
        await executeJavaScript(
          this.driver,
          "focus receiverName",
          "document.getElementById('recNameShow').focus()",
          500,
        );
      } catch (error) {
        if (error.name === "JavascriptError" || error.name === "TimeoutError") {
          setLog({
            level: "warn",
            message: `wait until name filled fail, ${retryTimes} times, Error: ${error}`,
          });
          continue;
        }
        throw error;
      } finally {
        retryTimes--;
      }
    }
  }

  // 检测页面最终获得的值
  async checkSubmitedValue() {
    var amount = await this.driver.findElement(By.id("Remit-Money")).getText(); //￥11.00
    amount = amount.replace("￥", "");
    amount = amount.replace(/,/g, "");
    if (parseFloat(amount) != parseFloat(this.task.requestAmount)) {
      throw new Error("amount is not right!");
    }

    var nameLine = await this.driver.findElement(By.id("custName_id")).getText(); // 张丽（尾号3878）转账
    var name = nameLine.split("（")[0];
    if (name != this.task.receiverName) {
      throw new Error("name is not right!");
    }

    var card = nameLine.replace(/[^0-9]/gi, "").trim();
    if (!card) {
      card = await this.driver.findElement(By.xpath("//span[@id='custName_id']/..")).getText(); //  注意 向 张丽（尾号3878）转账时 结构不一样
      card = card.replace(/[^0-9]/gi, "").trim();
    }

    if (card != this.task.bank.cardNumber.substr(this.task.bank.cardNumber.length - 4)) {
      throw new Error("Card number is not right!");
    }
  }

  async fillNote() {
    try {
      // final check
    } catch (error) {
      throw error;
    } finally {
      await this.driver.switchTo().defaultContent();
    }
  }
  async confirmTransferMessage() {
    await this.driver.wait(until.elementLocated(By.id("txmainfrm")));
    await this.driver.switchTo().frame("txmainfrm");
    await this.driver.wait(until.elementLocated(By.css("input.btn[type=submit]"))).click();

    //FIXME:
    // Not detected disable
    await this.driver.wait(until.elementIsDisabled(By.css("input.btn[type=submit]")));

    // Key in usb key
    await KeySender.sendText("abc123");
    // await KeySender.sendKey(KeySender.KeyEnum.RETURN);
  }
  async getBalance() {}
  async confirmTransaction() {}
  async sendUSBKey() {}
}
