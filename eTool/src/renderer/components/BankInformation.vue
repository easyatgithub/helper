<template>
  <div>
    <el-row
      type="flex"
      align="middle"
      class="function-row"
    >
      <el-col :span="8">Account</el-col>
      <el-col :span="12">
        <el-input
          size="small"
          v-model="accountCode"
        />
      </el-col>
      <el-col :span="4">
        <el-button
          type="info"
          size="small"
          @click="getAccountInfo"
          :disabled="isProcessing"
        >Search</el-button>
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="function-row"
    >
      <el-col :span="8">Proxy</el-col>
      <el-col :span="12">
        <el-select
          size="small"
          v-model="selectedProxyURL"
          placeholder="Select Proxy"
        >
          <el-option
            v-for="proxy in proxys"
            :key="proxy.key"
            :value="proxy.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button
          type="info"
          size="small"
          @click="launchSeleniumByBankRule"
          :disabled="isProcessing"
        >Launch</el-button>
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">Login Name</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="loginName"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">Login Password</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="loginPassword"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">Account Number</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="accountNumber"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">Account Holder Name</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="accountHolderName"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">Old Cookie</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="oldCookie"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">New Cookie</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="newCookie"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="info-row"
    >
      <el-col :span="8">Session ID</el-col>
      <el-col :span="16">
        <el-input
          size="mini"
          v-model="sessionID"
        />
      </el-col>
    </el-row>

    <el-row
      type="flex"
      align="middle"
      class="function-row"
    >
      <el-col :span="8">Transaction Time</el-col>
      <el-col :span="10">
        <el-input
          size="small"
          v-model="transactionTime"
        />
      </el-col>
      <el-col :span="6">
        <el-button
          type="info"
          size="small"
          @click="handleTimeClick"
          :disabled="isProcessing"
        >Set to -15 Mins</el-button>
      </el-col>
    </el-row>

    <el-alert
      v-if="alert.title"
      :title="alert.title"
      :type="alert.type"
      :description="alert.message"
      show-icon
    ></el-alert>

    <el-row
      type="flex"
      justify="space-around"
    >
      <el-button
        style="width:100%"
        size="small"
        type="primary"
        @click="submitSpecifiedData"
          :disabled="isProcessing"
      >Submit</el-button>
      <el-button
        style="width:100%"
        size="small"
        type
      >Close</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export default {
  data: () => ({
    accountID: 0,
    accountCode: process.env.NODE_ENV === 'development' ? 'BOT.001' : '',
    accountHolderName: '',
    bankCode: '',
    loginName: '',
    loginPassword: '',
    queryPassword: '',
    accountNumber: '',
    newCookie: '',
    city: '',
    isProcessing: false,
    oldCookie: '',
    transactionTime: '',
    sessionID: '',
    selectedProxyURL: '',
    proxys: [{ id: '', value: '' }],
    alert: {
      type: '',
      title: '',
      message: '',
    },
  }),
  methods: {
    getAccountInfo() {
      this.isProcessing = true;
      axios({
        method: 'POST',
        url: `${localStorage.backendUrl}/payment_bo/adminPaymentAcct!search.do`,
        headers: { cookie: localStorage.cookie },
      })
        .then(async (response) => {
          const selectedBankData = response.data.data
            .filter(bank => bank.acctCode === this.accountCode)[0];

          if (!selectedBankData) {
            this.showAlert(
              'error',
              'No such this account code',
              `Searched account code: ${this.accountCode}`,
            );
          } else {
            this.accountID = selectedBankData.id;
            this.bankCode = selectedBankData.bank.bankCode;
            this.loginName = selectedBankData.acctUsername;
            this.loginPassword = selectedBankData.acctPassword;
            this.accountNumber = selectedBankData.acctNum;
            this.oldCookie = this.getOldCookieByAccountID(selectedBankData.id);
            this.transactionTime = moment().format(DATE_FORMAT);
            this.proxys = await this.getAssignedProxyByAccountID(this.accountID);
            this.showAlert('success', 'Success', 'Get account information');
          }
        })
        .catch((error) => {
          this.showAlert('error', 'Searching account error', error);
        }).finally(() => {
          this.isProcessing = false;
        });
    },
    getOldCookieByAccountID(id) {
      axios({
        method: 'GET',
        url: `${localStorage.backendUrl}/adminAcct!loadRobotSession.do?a.id=${id}`,
        headers: { cookie: localStorage.cookie },
      })
        .then((response) => {
          const responseData = response.data.data;
          if (response != null && response.data != null) {
            this.oldCookie = responseData.oldCookie;
            this.accountHolderName = responseData.accountHolderName;
            this.queryPassword = responseData.queryPassword;
          }
        })
        .catch((error) => {
          this.showAlert('error', 'Searching old cookies error', error);
        });
    },
    async getAssignedProxyByAccountID(id) {
      let proxys;
      try {
        const response = await axios({
          method: 'GET',
          url: `${localStorage.backendUrl}/adminAcct!listAssignProxy.do?acctId=${id}`,
          headers: { cookie: localStorage.cookie },
        });
        proxys = response.data.data.map(proxy => ({
          id: proxy.key,
          value: proxy.value,
        }));
      } catch (error) {
        this.showAlert('error', 'Searching proxy error', error);
      }
      return proxys;
    },

    async launchSeleniumByBankRule() {
      try {
        this.isProcessing = true;
        this.showAlert('info', 'Launching...', 'Setting the enviroment...');
        const selectedProxyIP = this.selectedProxyURL.split('//')[1];
       
        this.newCookie = result.cookie;
        this.sessionID = result.session || 'No Session';
        this.showAlert('success', 'Success', 'Got cookie and session');
      } catch (error) {
        this.showAlert('error', 'Launch Selenium Error', error.toString());
      } finally {
        this.isProcessing = false;
      }
    },

    handleTimeClick() {
      this.transactionTime = moment()
        .add(-15, 'minutes')
        .format(DATE_FORMAT);
    },

    submitSpecifiedData() {
      this.isProcessing = true;
      axios({
        method: 'GET',
        headers: { cookie: localStorage.cookie },
        url: `${localStorage.backendUrl}/adminAcct!updateRobotSession.do?a.id=${
          this.accountID
        }&s.cookie=${encodeURIComponent(this.newCookie)}&s.proxy.id=${this.getSelectedProxyID()}&s.sessionId=${encodeURIComponent(this.sessionID)}&sessionMinTransTime=${
          this.transactionTime
        }&s.updatedAt=${moment().format(DATE_FORMAT)}&s.updatedBy.username=${
          JSON.parse(localStorage.userInfo).username
        }`,
      })
        .then((response) => {
          const { message } = response.data;
          if (message === 'success') {
            this.showAlert('success', 'Success', 'Submit success');
          } else {
            this.showAlert('error', 'Submit data fail', message);
          }
        })
        .catch((error) => {
          this.showAlert('error', 'Submit data error', error);
        }).finally(() => {
          this.isProcessing = false;
        });
    },

    getSelectedProxyID() {
      return this.proxys.filter(proxy => proxy.value === this.selectedProxyURL)[0].id;
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
.function-row {
  margin: 14px 0;
  .el-input {
    width: 95%;
  }
  .el-select {
    width: 95%;
  }
}

.info-row {
  margin: 2px 0;
}

.el-button {
  width: 100%;
}

.el-alert {
  margin: 16px 0;
}
</style>
