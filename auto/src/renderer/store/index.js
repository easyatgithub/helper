import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import task from "./modules/task";
import user from "./modules/user";
import card from "./modules/card";
import log from "./modules/log";
import worker from "./modules/worker";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    card,
    log,
    task,
    user,
    worker,
  },
  getters,
});

export default store;
