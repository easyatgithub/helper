import axios from "axios";
import qs from "qs";
import { MessageBox } from "element-ui";
import store from "../store";
import logger from "./logger";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
  // transformRequest: data => {
  //   return qs.stringify(data);
  // }
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: "brackets" });
  },
});

// This for handling async request, to prevent that if token was expired then show multiple message boxes
var isTokenExpired = false;
/**
 * Strip baseURL from URL
 *
 * @param {AxiosRequestConfig} config
 * @returns String
 */
function getUrl(config) {
  if (config.baseURL) {
    return config.url.replace(config.baseURL, "");
  }
  return config.url;
}

// request拦截器
service.interceptors.request.use(
  config => {
    config.headers["Accept"] = "application/json;charset=utf-8";
    if (store.getters.token) {
      config.headers["Authorization"] = store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // console.log(
    //   "%c " + config.method.toUpperCase() + " - " + getUrl(config) + ":",
    //   "color: #0086b3; font-weight: bold",
    //   config,
    // );
    logger.log({
      level: "info",
      message: {
        method: config.method.toUpperCase(),
        url: getUrl(config),
      },
    });
    return config;
  },
  error => Promise.reject(error),
);

// respone拦截器
service.interceptors.response.use(
  response => {
    // console.log(
    //   "%c " + response.status + " - " + getUrl(response.config) + ":",
    //   "color: #008000; font-weight: bold",
    //   response,
    // );
    logger.log({
      level: "info",
      message: {
        url: getUrl(response.config),
        status: response.status,
      },
    });

    return response;
  },
  error => {
    if (error.response.status === 403 && !isTokenExpired) {
      isTokenExpired = true;
      store.commit("HANDLE_TASK_FETCHABLE", false);
      MessageBox.confirm(
        "You have been log out by system, please re-login again",
        "Token Expired",
        {
          type: "error",
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
        },
      )
        .then(() => {
          store.dispatch("FedSignOut");
        })
        .catch(() => {})
        .finally(() => {
          isTokenExpired = false;
        });
    }

    if (error.response) {
      logger.log({
        level: "error",
        message:
          error.response.status + " - " + getUrl(error.response.config) + ": " + error.response,
      });
    } else {
      logger.log({
        level: "error",
        message: "No response from remote server",
      });
    }

    return Promise.reject(error);
  },
);

export default service;
