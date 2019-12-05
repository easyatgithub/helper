import moment from 'moment';
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

import App from './App';

import bobi from "../utils/db";

import globalData from "./globalData";




if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(ElementUI);

// Vue.prototype.globalData = globalData;


/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
}).$mount('#app');



var all = JSON.parse(localStorage.getItem('all'));
console.log("all")
console.log(all)
// console.log(all,this.globalData)
//this.globalData.setData(all)

import global from './components/common.vue'
Vue.prototype.COMMON = global

bobi.init(moment().format('YYYY-MM-DD'))
