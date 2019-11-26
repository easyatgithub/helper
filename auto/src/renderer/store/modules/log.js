import logger from "../../utils/logger";
// Log level
// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   verbose: 3,
//   debug: 4,
//   silly: 5
// }
const worker = {
  state: { log: [], console: [] },

  mutations: {
    // Record log
    SET_LOG: (state, { level, message }) => {
      logger.log({ level, message });
      state.log.push({ level, message });
    },
    UNSET_LOG: state => {
      state.log = [];
    },
    // Show on application and record log
    SET_CONSOLE: (state, { level, message }) => {
      logger.log({ level, message });
      state.console.push({ level, message });
    },
    UNSET_CONSOLE: state => {
      state.console = [];
    },
  },

  actions: {
    UnsetLog({ commit }) {
      commit("UNSET_LOG", []);
      commit("UNSET_CONSOLE", []);
    },
  },
};

export default worker;
