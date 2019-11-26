import { ThenableWebDriver, WebElementPromise } from "selenium-webdriver";
import { OperationalError } from "./workerErrorHandler";
import { asyncForEach } from "../../renderer/utils/asyncForEach";
import { setLog } from "./storeHelper";
/**
 * Execute JavaScript
 * @param {ThenableWebDriver} driver
 * @param {String} name - tell other developer what executed
 * @param {String} script - JavaScript code
 * @param {Number} delaySeconds - delay how long to execute script
 */
export async function executeJavaScript(driver, name, script, delayMilliseconds = 1000) {
  try {
    if (!name) throw new Error("You didn't set the name of this execute method");
    await driver.sleep(delayMilliseconds);
    await driver.executeScript(script);
  } catch (error) {
    if (error.name === "JavascriptError") {
      throw new OperationalError(
        `JavaScript execute fail, execute name: '${name}', execute script: '${script}'`,
      );
    }
    throw error;
  }
}

/**
 * Custom selenium sendkeys
 *
 * 封裝 selenium 的 sendKeys 方法並實作如下功能：
 * 1. 使其能夠指定每個字元的輸入間隔，解決在 VM 上有時輸入延遲的問題
 * 2. 輸入文字後檢查輸入之值與給定值相同，避免輸入金額錯誤
 * 3. 開發人員可指定輸入錯誤後，可重複嘗試次數，若達到上限則會報錯，並使系統停止本次轉帳任務
 * 4. 自動增加延遲輸入時間（例：若第一次輸入文字間隔為 100 ms，但檢查後發現輸入錯誤，則第二次會增加延遲的時間至 100ms * 執行次數），透過這樣的方式來增加輸入成功率
 * @param {WebElementPromise} webElement
 * @param {Object} options
 * @param {String} options.text - the text what wants to send
 * @param {String} options.replaceRule - the rule to change the format to match text
 * @param {Number} options.maxExecuteTimes - Maximize execute times
 * @param {Number} options.ms - How long should wait during each input character
 * @param executedTimes - WARNNING! Do not set this parameter's value, this for record how many times recursion to call
 */
export async function sendKeys(
  webElement,
  { text, replaceRule = "", maxExecuteTimes = 3, ms = 100 },
  executedTimes = 1,
) {
  try {
    if (!text) throw new Error("You didn't set the text to send");

    await asyncForEach(text.split(""), async char => {
      await webElement.sendKeys(char);
      await new Promise(resolve => setTimeout(resolve, ms));
    });

    // Check if input correctly
    const inputedValue = await getElementValue(webElement);
    if (text !== inputedValue.replace(replaceRule, "")) {
      setLog({
        level: "warn",
        message: `System has try ${executedTimes} times to send keys but fail`,
      });
      await webElement.clear();
      if (executedTimes === maxExecuteTimes) {
        throw new Error(
          `System has not able to send keys correctly, total retries: ${maxExecuteTimes} times`,
        );
      }
      await sendKeys(
        webElement,
        { text, replaceRule, maxExecuteTimes, ms: 100 * executedTimes },
        ++executedTimes,
      );
    }
  } catch (error) {
    if (error.name === "JavascriptError") {
      throw new OperationalError(`Send keys error, error: ${error.toString()}`);
    }
    throw error;
  }
}

/**
 *
 * @param {WebElementPromise} webElement
 * @returns {Promise<string>}
 */
export async function getElementValue(webElement) {
  try {
    return await webElement.getAttribute("value");
  } catch (error) {
    throw new OperationalError(error);
  }
}
/**
 *
 * @param {ThenableWebDriver} driver
 */
export async function waitPageLoad(driver) {
  try {
    await driver.wait(async () => {
      const readyState = await driver.executeScript("return document.readyState");
      return readyState === "complete";
    });
  } catch (error) {
    throw new OperationalError(error);
  }
}

/**
 *
 * @param {ThenableWebDriver} driver
 * @param {String} waitingType
 */
export async function waitUtilGetText(driver, waitingType) {
  try {
    var text;
    while (!text) {
      text = await driver.wait(waitingType).getText();
    }
    return text;
  } catch (error) {
    throw new OperationalError(error);
  }
}

/**
 * wait focus
 * @param {ThenableWebDriver} driver
 * @param {WebElementPromise} webElement
 */
export async function waitElementFocused(driver, webElement) {
  var retryTime = 3;
  while (retryTime >= 0) {
    try {
      const toFocusElement = await webElement.getAttribute("outerHTML");

      await webElement.sendKeys("");
      await driver.sleep(100);

      var activedElement = await driver
        .switchTo()
        .activeElement()
        .getAttribute("outerHTML");
      if (toFocusElement === activedElement) break;
      if (retryTime === 0) {
        throw new Error("focus element fail");
      }
      retryTime--;
    } catch (error) {
      if (error.name === "NoSuchElementError" || error.name === "TimeoutError") {
        return setLog({ level: "warn", message: error });
      }
      throw error;
    }
  }
}
