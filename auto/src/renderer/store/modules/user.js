import { login, logout } from "@/api/auth";
import { getToken, setToken, removeToken } from "@/utils/auth";
import router from "@/router";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password)
          .then(response => {
            const data = response.data;
            const token = data.token;
            setToken(token);
            commit("SET_TOKEN", token);
            commit("SET_NAME", data.userName);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token).then(response => {
    //       const data = response.data
    //       if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', data.roles)
    //       } else {
    //         reject('getInfo: roles must be a non-null array !')
    //       }
    //       commit('SET_NAME', data.name)
    //       commit('SET_AVATAR', data.avatar)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    async SignOut({ commit, dispatch, state }) {
      try {
        await logout();
      } catch (error) {
        return commit("SET_LOG", { level: "warn", message: `Call Signed out api fail` });
      }
    },

    // 前端 登出
    async FedSignOut({ commit, dispatch, state }) {
      var username = state.name;
      try {
        await dispatch("ResetSystem");
        commit("SET_TOKEN", "");
        commit("SET_NAME", "");
        removeToken();
        router.push({ path: "/login-to-system" });
        commit("SET_LOG", { level: "info", message: `User: "${username}" signed out` });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default user;
