<template>
<div>
  <el-row>
    <h1>BO Login</h1>
    <el-col
      :span="20"
      :offset="2"
    >
      <el-form
        ref="login-form"
        :model="form"
      >
        <el-form-item>
          <el-input
            v-model="form.username"
            placeholder="Username"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="password"
            v-model="form.password"
            placeholder="Password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="selectedURL"
            placeholder="URL"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="login"
          >Login</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
      <el-alert
        v-if="alert.title"
        :title="alert.title"
        :type="alert.type"
        :description="alert.message"
        show-icon
      ></el-alert>
</div>
</template>

<script>
import axios from 'axios';
 
const { remote, ipcRenderer } = window.require("electron");

export default {
  name: 'login',
  data: () => ({
    form: {
      username: process.env.NODE_ENV === 'development' ? 'jeremy.s' : '',
      password: process.env.NODE_ENV === 'development' ? '1111' : '',
    },
    alert: {
      type: '',
      title: '',
      message: '',
    },
    selectedURL: '',
    options: [
      { value: 'http://www.tcgpayment.com' },
      { value: 'http://10.8.90.24:7001/payment_bo' },
      { value: 'http://10.101.140.101:7001/payment_bo' },
      { value: 'http://10.8.90.51:7001/payment_bo' },
      { value: 'http://172.19.196.70:8602' },
      { value: 'http://10.8.95.22:7001/payment_bo' },
    ],
  }),
  methods: {
    async login() { 
          
    },
    async login1() {
      try {
        if (!this.selectedURL) {
          this.showAlert('error', 'Login Fail', 'Please select URL.');
          return;
        }
        const response = await axios.get(`${this.selectedURL
        }/aLogin!login.do?username=${this.form.username
        }&password=${this.form.password}`);

        if (response.data.code === 1) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.data.admin));
          localStorage.setItem('cookie', response.headers['set-cookie'][0]);
          localStorage.setItem('backendUrl', this.selectedURL);
          this.$emit('loginSuccessed');
        } else {
          this.showAlert(
            'error',
            'Login Fail',
            'Please check your name and password',
          );
        }
      } catch (error) {
        this.showAlert('error', 'System Error', error);
      }
    },
    showAlert(type, title, message) {
      this.alert.type = type;
      this.alert.title = title;
      this.alert.message = message;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  h1 {
    text-align: center;
  }
  .el-form {
    .el-select {
      width: 100%;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
