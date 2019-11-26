import { screen } from "electron";
import { Builder } from "selenium-webdriver";
import {
  setLog,
  setCookieAndSession,
  updateFlowStatus,
  updateSignInFlowStatus,
  getSelectedTaskDetail,
  markTaskSuccess,
  getSelectedCardDetail,
} from "./utils/storeHelper";
import { setProxy, unsetProxy, setIEEnviroment } from "./utils/regeditTool";
import { workflowEnum, workflowStatusEnum } from "./utils/workflowHelper";
import { MessageBox } from "element-ui";
import ABCWorker from "./ABCWorker";
import BCMWorker from "./BCMWorker";
import BOCWorker from "./BOCWorker";
import CCBWorker from "./CCBWorker";
import CITICWorker from "./CITICWorker";
import CMBCWorker from "./CMBCWorker";
import ICBCWorker from "./ICBCWorker";
import JZBWorker from "./JZBWorker";
import PSBCWorker from "./PSBCWorker";
import HRBBWorker from "./HRBBWorker";
import PINGANWorker from "./PINGANWorker";
import BOBWorker from "./BOBWorker";

function getInstance(data) {
  if (data.accountCode.indexOf("ABC") !== -1) return new ABCWorker();
  else if (data.accountCode.indexOf("BCM") !== -1) return new BCMWorker();
  else if (data.accountCode.indexOf("BOB") !== -1) return new BOBWorker();
  else if (data.accountCode.indexOf("BOC") !== -1) return new BOCWorker();
  else if (data.accountCode.indexOf("CCB") !== -1) return new CCBWorker();
  else if (data.accountCode.indexOf("CITIC") !== -1) return new CITICWorker();
  else if (data.accountCode.indexOf("CMBC") !== -1) return new CMBCWorker();
  else if (data.accountCode.indexOf("HRBB") !== -1) return new HRBBWorker();
  else if (data.accountCode.indexOf("ICBC") !== -1) return new ICBCWorker();
  else if (data.accountCode.indexOf("JZB") !== -1) return new JZBWorker();
  else if (data.accountCode.indexOf("PINGAN") !== -1) return new PINGANWorker();
  else if (data.accountCode.indexOf("PSBC") !== -1) return new PSBCWorker();
  else throw new Error("No such bank rule");
}

/**
 * Worker factory
 * @class
 * @constructor
 * @public
 */
export default class WorkerFactory {
  /**
   *
   * @param {Object} data
   * @param {String} data.accountCode
   * @param {String} data.bankCode
   * @param {String} data.accountName
   * @param {String} data.accountPassword
   * @param {String} data.usbPassword
   * @param {String} data.proxy
   */
  constructor(data) {
    this.instance = getInstance(data);
    this.card = getSelectedCardDetail();
  }

  async setIEEnviroment() {
    try {
      updateSignInFlowStatus({
        name: workflowEnum().SET_IE_ENVIROMENT,
        status: workflowStatusEnum.RUNNING,
      });

      await setIEEnviroment();

      updateSignInFlowStatus({
        name: workflowEnum().SET_IE_ENVIROMENT,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "IE enviroment set", level: "info" });
    } catch (error) {
      updateSignInFlowStatus({
        name: workflowEnum().SET_IE_ENVIROMENT,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async setProxy() {
    try {
      updateSignInFlowStatus({
        name: workflowEnum().SET_PROXY,
        status: workflowStatusEnum.RUNNING,
      });

      await setProxy(this.card.proxy);

      updateSignInFlowStatus({
        name: workflowEnum().SET_PROXY,
        status: workflowStatusEnum.SUCCESS,
      });

      setLog({ message: "Proxy set", level: "info" });
    } catch (error) {
      updateSignInFlowStatus({
        name: workflowEnum().SET_PROXY,
        status: workflowStatusEnum.FAIL,
      });

      throw error;
    }
  }

  async unsetProxy() {
    try {
      await unsetProxy();
      setLog({ message: "Proxy unset", level: "info" });
    } catch (error) {
      throw error;
    }
  }

  async launchSelenium() {
    try {
      updateSignInFlowStatus({
        name: workflowEnum().LAUNCH_SELENIUM,
        status: workflowStatusEnum.RUNNING,
      });

      this.instance.driver = await new Builder()
        .withCapabilities({
          ignoreZoomSetting: true,
          // requireWindowFocus: true
        })
        .forBrowser("ie")
        .build();

      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      await this.instance.driver
        .manage()
        .window()
        .setSize(width * (1 / 2), height);
      await this.instance.driver
        .manage()
        .window()
        .setPosition(0, 0);

      await this.instance.launchSelenium();

      updateSignInFlowStatus({
        name: workflowEnum().LAUNCH_SELENIUM,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Selenium launched", level: "info" });
    } catch (error) {
      updateSignInFlowStatus({
        name: workflowEnum().LAUNCH_SELENIUM,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async closeSelenium() {
    try {
      if (this.instance.driver) await this.instance.driver.quit();

      setLog({ message: "Selenium closed", level: "info" });
    } catch (error) {
      throw error;
    }
  }

  async loginToBank() {
    try {
      updateSignInFlowStatus({
        name: workflowEnum().LOGIN_TO_BANK,
        status: workflowStatusEnum.RUNNING,
      });

      await this.instance.loginToBank();

      updateSignInFlowStatus({
        name: workflowEnum().LOGIN_TO_BANK,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Bank Loggined", level: "info" });
    } catch (error) {
      updateSignInFlowStatus({
        name: workflowEnum().LOGIN_TO_BANK,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async sendUSBKey() {
    try {
      updateSignInFlowStatus({
        name: workflowEnum().SEND_USB_KEY,
        status: workflowStatusEnum.RUNNING,
      });

      await this.instance.sendUSBKey();

      updateSignInFlowStatus({
        name: workflowEnum().SEND_USB_KEY,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "USB key sent", level: "info" });
    } catch (error) {
      updateSignInFlowStatus({
        name: workflowEnum().SEND_USB_KEY,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  /**
   *
   * @param {Object} globalState
   * @param {Boolean} globalState.isManualLogin
   */
  async checkIfLoginSuccess(globalState) {
    try {
      updateSignInFlowStatus({
        name: workflowEnum().CHECK_IF_LOGIN_SUCCESS,
        status: workflowStatusEnum.RUNNING,
      });

      await this.instance.checkIfLoginSuccess(globalState);

      updateSignInFlowStatus({
        name: workflowEnum().CHECK_IF_LOGIN_SUCCESS,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Is loggined", level: "info" });
    } catch (error) {
      updateSignInFlowStatus({
        name: workflowEnum().CHECK_IF_LOGIN_SUCCESS,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async getCookie() {
    try {
      updateFlowStatus({
        name: workflowEnum().GET_COOKIE,
        status: workflowStatusEnum.RUNNING,
      });

      setCookieAndSession(await this.instance.getCookie());

      updateFlowStatus({
        name: workflowEnum().GET_COOKIE,
        status: workflowStatusEnum.SUCCESS,
      });

      setLog({ message: "Got cookie and session", level: "info" });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().GET_COOKIE,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async goTransferPage() {
    updateFlowStatus({
      name: workflowEnum().GO_TRANSFER_PAGE,
      status: workflowStatusEnum.RUNNING,
    });
    try {
      await this.instance.goTransferPage();

      updateFlowStatus({
        name: workflowEnum().GO_TRANSFER_PAGE,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Redirected to transfer page", level: "info" });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().GO_TRANSFER_PAGE,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async fillTransferFrom() {
    updateFlowStatus({
      name: workflowEnum().FILL_TRANSFER_INFORMATION,
      status: workflowStatusEnum.RUNNING,
    });
    try {
      var taskDetail = getSelectedTaskDetail();
      if (taskDetail === null) throw new Error(`You didn't select the task`);

      await this.instance.fillTransferFrom();

      updateFlowStatus({
        name: workflowEnum().FILL_TRANSFER_INFORMATION,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Transfer form filled", level: "info" });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().FILL_TRANSFER_INFORMATION,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async fillNote() {
    updateFlowStatus({
      name: workflowEnum().FILL_NOTE,
      status: workflowStatusEnum.RUNNING,
    });
    try {
      await this.instance.fillNote();

      updateFlowStatus({
        name: workflowEnum().FILL_NOTE,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Note filled", level: "info" });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().FILL_NOTE,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }
  async confirmTransaction() {
    updateFlowStatus({
      name: workflowEnum().CONFIRM_TRANSACTION,
      status: workflowStatusEnum.RUNNING,
    });
    try {
      await this.instance.confirmTransaction();

      updateFlowStatus({
        name: workflowEnum().CONFIRM_TRANSACTION,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Transaction confirmed", level: "info" });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().CONFIRM_TRANSACTION,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }

  async checkIfSuccess() {
    updateFlowStatus({
      name: workflowEnum().CHECK_IF_SUCCESS,
      status: workflowStatusEnum.RUNNING,
    });
    try {
      var isCheckSuccess = await this.instance.checkIfSuccess();
      // TODO: Discuss how to detect as success
      if (isCheckSuccess) {
        await markTaskSuccess();
        setLog({
          message: "Transfer success, you can start next transaction",
          type: "info",
        });
      } else {
        setLog({
          level: "warn",
          message: "System can't check the transfer result, please check it manually",
        });
        // TODO:
        detectTransferFail();
      }
      updateFlowStatus({
        name: workflowEnum().CHECK_IF_SUCCESS,
        status: workflowStatusEnum.SUCCESS,
      });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().CHECK_IF_SUCCESS,
        status: workflowStatusEnum.FAIL,
      });
      setLog({
        message: "Transfer error, please see the website to check the problem",
        level: "error",
      });
      throw error;
    }
  }

  async getBalance() {
    updateFlowStatus({
      name: workflowEnum().GET_BALANCE,
      status: workflowStatusEnum.RUNNING,
    });
    try {
      await this.instance.getBalance();

      updateFlowStatus({
        name: workflowEnum().GET_BALANCE,
        status: workflowStatusEnum.SUCCESS,
      });
      setLog({ message: "Balance got", level: "info" });
    } catch (error) {
      updateFlowStatus({
        name: workflowEnum().GET_BALANCE,
        status: workflowStatusEnum.FAIL,
      });
      throw error;
    }
  }
}

function detectTransferFail() {
  MessageBox.confirm("Please check transfer result", "Info", {
    confirmButtonText: "Success",
    cancelButtonText: "Fail",
    showClose: false,
    closeOnClickModal: false,
    type: "warning",
  })
    .then(async () => {
      try {
        await markTaskSuccess();
        setLog({
          level: "warn",
          message: "Task has been mark as success",
        });
      } catch (error) {
        MessageBox.alert(error.message, "Error!!", {
          type: "error",
          confirmButtonText: "Close",
        });
      }
    })
    .catch(() => {
      MessageBox.confirm("Are you sure want to mark this task as fail?", "Confirm Fail", {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      })
        .then(async () => {
          // TODO: the api of mark fail
          setLog({
            level: "info",
            message: "Task has been mark as fail",
          });
        })
        .catch(() => {
          detectTransferFail();
        });
    });
}
