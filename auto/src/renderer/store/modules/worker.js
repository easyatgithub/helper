import WorkerFactory from "../../../worker";
import { workflowEnum, signInWorkflowEnum } from "../../../worker/utils/workflowHelper";

const worker = {
  state: { runner: null, workflow: [], signInWorkflow: [] },

  mutations: {
    SET_WORKER: (state, runner) => {
      state.runner = runner;
    },
    SET_SIGN_IN_WORKFLOW: (state, isManualSignIn) => {
      state.signInWorkflow = signInWorkflowEnum(isManualSignIn);
    },
    // data: name, status
    UPDATE_SIGN_IN_FLOW_STATUS: (state, data) => {
      state.signInWorkflow.forEach(flow => {
        if (flow.name === data.name) {
          flow.status = data.status;
        }
      });
      var signInWorkflow = state.signInWorkflow;
      state.signInWorkflow = [];
      state.signInWorkflow = signInWorkflow;
    },
    SET_WORKFLOW: (state, bankCode) => {
      state.workflow = workflowEnum(bankCode);
    },
    // data: name, status
    UPDATE_FLOW_STATUS: (state, data) => {
      state.workflow.forEach(flow => {
        if (flow.name === data.name) {
          flow.status = data.status;
        }
      });
      var workflow = state.workflow;
      state.workflow = [];
      state.workflow = workflow;
    },
  },

  actions: {
    async SetIEEnviroment({ commit, getters }) {
      try {
        return await getters.worker.runner.setIEEnviroment();
      } catch (error) {
        commit("SET_LOG", {
          message: "Set ie enviroment fail",
          level: "error",
        });
        throw error;
      }
    },
    async SetProxy({ commit, getters }) {
      try {
        return await getters.worker.runner.setProxy();
      } catch (error) {
        commit("SET_LOG", {
          message: "Set proxy fail",
          level: "error",
        });
        throw error;
      }
    },
    async LaunchSelenium({ commit, getters }) {
      try {
        return await getters.worker.runner.launchSelenium();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async CloseSelenium({ commit, getters }) {
      try {
        if (getters.worker.runner) await getters.worker.runner.closeSelenium();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async LoginToBank({ commit, getters }) {
      try {
        return await getters.worker.runner.loginToBank();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async SendUSBKey({ commit, getters }) {
      try {
        await getters.worker.runner.sendUSBKey();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async CheckIfLoginSuccess({ commit, dispatch, getters }) {
      try {
        const isManualLogin = getters.app.isManualLogin;
        await getters.worker.runner.checkIfLoginSuccess({ isManualLogin });

        await dispatch("GetAllTasks");
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async GetCookie({ commit, getters }) {
      try {
        await getters.worker.runner.getCookie();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async GetBalance({ commit, getters }) {
      try {
        await getters.worker.runner.getBalance();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async GoTransferPage({ commit, getters }) {
      try {
        await getters.worker.runner.goTransferPage();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async FillTransferFrom({ commit, getters }) {
      try {
        await getters.worker.runner.fillTransferFrom();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async FillNote({ commit, getters }) {
      try {
        await getters.worker.runner.fillNote();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async ConfirmTransaction({ commit, getters }) {
      try {
        await getters.worker.runner.confirmTransaction();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },
    async CheckIfSuccess({ commit, getters }) {
      try {
        await getters.worker.runner.checkIfSuccess();
      } catch (error) {
        commit("SET_LOG", {
          message: error.message,
          level: "error",
        });
        throw error;
      }
    },

    async SetWorker({ commit, getters }) {
      commit("SET_WORKER", new WorkerFactory(getters.card.selectedDetail));
      commit("SET_WORKFLOW", getters.card.selectedDetail.accountCode);
    },
    async UnsetWorker({ commit, dispatch }) {
      await dispatch("CloseSelenium");
      commit("SET_WORKER", null);
      commit("SET_WORKFLOW", null);
    },

    async RunSelectedFlow({ dispatch }, flowName) {
      const publicWorkflowEnum = workflowEnum();
      switch (flowName) {
        case publicWorkflowEnum.SET_IE_ENVIROMENT:
          return await dispatch("SetIEEnviroment");
        case publicWorkflowEnum.SET_PROXY:
          return await dispatch("SetProxy");
        case publicWorkflowEnum.LAUNCH_SELENIUM:
          return await dispatch("LaunchSelenium");
        case publicWorkflowEnum.CLOSE_SELENIUM:
          return await dispatch("CloseSelenium");
        case publicWorkflowEnum.LOGIN_TO_BANK:
          return await dispatch("LoginToBank");
        case publicWorkflowEnum.SEND_USB_KEY:
          return await dispatch("SendUSBKey");
        case publicWorkflowEnum.CHECK_IF_LOGIN_SUCCESS:
          return await dispatch("checkIfLoginSuccess");
        case publicWorkflowEnum.GET_COOKIE:
          return await dispatch("GetCookie");
        case publicWorkflowEnum.GET_BALANCE:
          return await dispatch("GetBalance");
        case publicWorkflowEnum.GO_TRANSFER_PAGE:
          return await dispatch("GoTransferPage");
        case publicWorkflowEnum.FILL_TRANSFER_INFORMATION:
          return await dispatch("FillTransferFrom");
        case publicWorkflowEnum.FILL_NOTE:
          return await dispatch("FillNote");
        case publicWorkflowEnum.CONFIRM_TRANSACTION:
          return await dispatch("ConfirmTransaction");
        case publicWorkflowEnum.CHECK_IF_SUCCESS:
          return await dispatch("CheckIfSuccess");
        default:
          throw new Error("No such workflow");
      }
    },
    async RunManualLoginFlows({ dispatch, commit }) {
      try {
        await dispatch("SetIEEnviroment");
        await dispatch("SetProxy");
        await dispatch("LaunchSelenium");

        commit("SET_LOG", {
          message: "Launch IE success, you can start login",
          level: "info",
        });
      } catch (error) {
        throw error;
      }
    },
    async RunAutoLoginFlows({ dispatch, commit }) {
      try {
        await dispatch("SetIEEnviroment");
        await dispatch("SetProxy");
        await dispatch("LaunchSelenium");
        await dispatch("LoginToBank");
        await dispatch("SendUSBKey");
        await dispatch("CheckIfLoginSuccess");
        await dispatch("GetCookie");

        await dispatch("GetBalance");

        commit("SET_LOG", {
          message: "Log in success, you can start transfer now",
          level: "info",
        });
      } catch (error) {
        throw error;
      }
    },
    async RunTransferFlows({ dispatch, commit }) {
      commit("HANDLE_TASK_HANDLING", true);
      try {
        await dispatch("GoTransferPage");
        await dispatch("FillTransferFrom");
        await dispatch("FillNote");
        await dispatch("ConfirmTransaction");
        await dispatch("CheckIfSuccess");
        commit("SET_LOG", {
          message: "Transfer success, you can start another transfer now",
          level: "info",
        });
      } catch (error) {
        throw error;
      } finally {
        commit("HANDLE_TASK_HANDLING", false);
      }
    },
    // This is for temporary use
    async RunLaunchSeleniumFlows({ dispatch, commit }) {
      try {
        await dispatch("SetProxy");
        await dispatch("LaunchSelenium");
        commit("SET_LOG", {
          message: "Browser launched",
          level: "info",
        });
      } catch (error) {
        throw error;
      }
    },
    async GoAndFillTransferInformation({ dispatch, commit }) {
      try {
        // FIXME
        // commit("HANDLE_TASK_FETCHABLE", false);
        await dispatch("GoTransferPage");
        await dispatch("FillTransferFrom");
        commit("SET_LOG", {
          message: "Transfer fill success, you can continue the remaining task",
          level: "info",
        });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default worker;
