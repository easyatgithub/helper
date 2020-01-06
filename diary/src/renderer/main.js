import moment from "moment";
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

import axios from "axios";

import App from "./App";

import lowdb from "../utils/lowdb";

import globalData from "./globalData";
import FullCalendar from "vue-fullcalendar";

import createPersistedState from "vuex-persistedstate";

Vue.use(FullCalendar);

import Vuex from "vuex";

Vue.use(Vuex);

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.use(Viewer);
Viewer.setDefaults({
  inline: true,
  button: true, //右上角按钮
  navbar: true, //底部缩略图
  title: true, //当前图片标题
  toolbar: true, //底部工具栏
  tooltip: true, //显示缩放百分比
  movable: true, //是否可以移动
  zoomable: true, //是否可以缩放
  rotatable: true, //是否可旋转
  scalable: true, //是否可翻转
  transition: true, //使用 CSS3 过度
  fullscreen: true, //播放时是否全屏
  keyboard: true, //是否支持键盘
  url: "data-source",
  ready: function(e) {
    document.querySelector(".viewer-container").style.height = "500px";
    console.log(e.type, "组件以初始化");
  },
  show: function(e) {
    console.log(e.type, "图片显示开始");
  },
  shown: function(e) {
    console.log(e.type, "图片显示结束");
  },
  hide: function(e) {
    console.log(e.type, "图片隐藏完成");
  },
  hidden: function(e) {
    console.log(e.type, "图片隐藏结束");
  },
  view: function(e) {
    console.log(e.type, "视图开始");
  },
  viewed: function(e) {
    console.log(e.type, "视图结束");
    // 索引为 1 的图片旋转20度
    // if(e.detail.index === 1){
    //     this.viewer.rotate(20);
    // }
  },
  zoom: function(e) {
    console.log(e.type, "图片缩放开始");
  },
  zoomed: function(e) {
    console.log(e.type, "图片缩放结束");
  }
});
// https://blog.csdn.net/guozhangqiang/article/details/82251893
// Vue.prototype.globalData = globalData;

/* eslint-disable no-new */
var db_data = {
  my: lowdb.get("my") || [],
  history: lowdb.get("history") || []
};

console.log("db_data===============");
console.log(db_data);
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    db: lowdb, // Store 居然是能綁定狀態的
    init() {
      // var my = this.db.get("my");
      //  this.data = my;
    },
    save() {
      console.log(this.data);
      this.db.set("my", this.data);
    },
    curStyleChoose: 1,
    data: db_data,
    folders: [
      {
        forderName: "FF1",
        items: [
          {
            path: "D:\\FF1\\",
            filename: "ccb.gif",
            text: "1111111111111"
          }
        ]
      },
      {
        forderName: "FF2",
        items: [
          {
            path: "D:\\FF3\\",
            filename: "a.png",
            text: "2222222222 ccb.gif"
          },
          {
            path: "D:\\FF3\\",
            filename: "b.png",
            text: "22 ccb.gif"
          }
        ]
      },
      {
        forderName: "FF3",
        items: [
          {
            path: "D:\\FF3\\",
            filename: "c.png",
            text: "33 ccb.gif"
          },
          {
            path: "D:\\FF3\\",
            filename: "d.png",
            text: "32 ccb.gif"
          },
          {
            path: "D:\\FF3\\",
            filename: "e.png",
            text: "33 ccb.gif"
          }
        ]
      }
    ]
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  }
});

new Vue({
  store,
  components: { App },
  template: "<App/>"
}).$mount("#app");

var all = JSON.parse(localStorage.getItem("all"));
console.log("all");
console.log(all);
import global from "./components/common.vue";
Vue.prototype.COMMON = global;
