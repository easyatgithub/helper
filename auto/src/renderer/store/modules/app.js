const getDefaultState = () => {
  return {
    platform: "leepay",
    showingTab: "accounts",
    isManualLogin: true,
    task: {
      isVisible: false,
      isFetchable: false,
      isFetching: false,
      isShowMarkAsFailDialog: false,
      isShowMarkAsSuccessDialog: false,
      isTaskHandling: false,
      fetchTimer: 9,
      isAutoProcess: false,
    },
    account: {
      showingPage: "bank-card-search",
      isSignInSuccess: false,
    },
  };
};
const app = {
  state: getDefaultState(),
  mutations: {
    HANDLE_SHOWING_TAB: (state, tabName) => {
      state.showingTab = tabName;
    },
    HANDLE_MANUAL_LOGIN: (state, status) => {
      state.isManualLogin = status;
    },

    HANDLE_MARK_AS_SUCCESS_DIALOG: (state, status) => {
      state.task.isShowMarkAsSuccessDialog = status;
    },
    HANDLE_MARK_AS_FAIL_DIALOG: (state, status) => {
      state.task.isShowMarkAsFailDialog = status;
    },
    HANDLE_TASK_VISIBLE: (state, status) => {
      state.task.isVisible = status;
    },
    HANDLE_TASK_AUTO_PROCESS: (state, status) => {
      state.task.isAutoProcess = status;
    },
    HANDLE_TASK_FETCHABLE: (state, status) => {
      state.task.isFetchable = status;
    },
    HANDLE_TASK_FETCHING: (state, status) => {
      state.task.isFetching = status;
    },
    MINUS_TASK_FETCH_TIMER: state => {
      state.task.fetchTimer--;
    },
    RESET_TASK_FETCH_TIMER: (state, time = 9) => {
      state.task.fetchTimer = time;
    },
    HANDLE_TASK_HANDLING: (state, status) => {
      state.task.isTaskHandling = status;
    },

    // Account
    // bank-card-search, select-sign-in-type, sign-in-to-bank
    HANDLE_ACCOUNT_SHOWING_PAGE: (state, status = "bank-card-search") => {
      state.account.showingPage = status;
    },
    HANDLE_ACCOUNT_SIGN_IN_SUCCESS: (state, status) => {
      state.account.isSignInSuccess = status;
    },
    RESET_APP_STATE: state => {
      Object.assign(state, getDefaultState());
    },
  },
  actions: {
    async ResetSystem({ commit, dispatch }) {
      try {
        commit("RESET_APP_STATE");

        await Promise.all([
          dispatch("UnsetCard"),
          dispatch("UnsetLog"),
          dispatch("UnsetTask"),
          dispatch("UnsetWorker"),
        ]);
      } catch (error) {
        return commit("SET_CONSOLE", { level: "error", message: error.toString() });
      }
    },
  },
};

export default app;
