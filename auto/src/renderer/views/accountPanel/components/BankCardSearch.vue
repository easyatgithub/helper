<template>
  <div class="bank-card-search">
    <div class="bank-card-search__body">
      <div class="bank-card-search__prompt">Please select the account to use</div>
      <el-form
        :model="form"
        :inline="true"
        class="bank-card-search__form"
        label-position="left"
        @submit.native.prevent
      >
        <el-form-item
          label="Bank Code"
          label-width="90px"
        >
          <el-input
            v-model="form.accountCode"
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="isSearchingCard"
            size="small"
            @click="searchCardByBankCode"
          >Search</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        ref="acctCodeTable"
        size="mini"
        :data="tableData"
        style="width: 100%"
        :height="tableHeight"
        highlight-current-row
        border
        @current-change="handleCurrentChange"
      >
        <el-table-column
          prop="accountCode"
          label="Account"
        />
        <el-table-column
          prop="balance"
          label="Balance"
        />
        <el-table-column
          prop="bank.bankName"
          label="Channel Group"
        />
      </el-table>
    </div>
    <div class="bank-card-search__footer">
      <el-button
        v-if="!currentAccount.accountCode"
        class="bank-card-search__footer-button"
        :loading="isSigningInBank"
        :disabled="!selectedBankCard"
        @click="handleBankCardSelect"
      >Select</el-button>
      <el-button
        v-if="currentAccount.accountCode"
        class="bank-card-search__footer-button"
        :loading="isSigningInBank"
        :disabled="!selectedBankCard"
        @click="handleBankCardChange"
      >
        <span v-if="!selectedBankCard">Change</span>
        <span v-if="selectedBankCard && (currentAccount.accountCode !== selectedBankCard.accountCode)">Change</span>
        <span v-if="selectedBankCard && (currentAccount.accountCode === selectedBankCard.accountCode)">Reselect</span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getList, getDetailById } from "@/api/card";
export default {
  name: "BankCardSearch",
  props: {
    bankSearchVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSearchingCard: false,
      isSigningInBank: false,
      selectedBankCard: "",
      tableData: [],
      form: {
        accountCode: process.env.NODE_ENV === "development" ? "293" : "",
      },
    };
  },
  computed: {
    ...mapGetters(["app", "card", "worker"]),
    currentAccount() {
      return this.card.current;
    },
    tableHeight() {
      // top header, tab margin, tab content, info header, bank search prompt, search, footer, others
      return window.innerHeight - 50 - 16 - 30 - 65 - 74 - 57 - 56 - 30;
    },
  },
  methods: {
    async searchCardByBankCode() {
      try {
        this.isSearchingCard = true;
        var codeList = await getList();
        this.tableData = codeList.data.value
          .map(card => {
            return {
              id: card.id,
              accountCode: card.bankAcctCode,
              bankCode: card.bank.bankCode,
            };
          })
          .filter(card => card.accountCode.indexOf(this.form.accountCode) !== -1);
      } catch (error) {
        console.log(error);
      } finally {
        this.isSearchingCard = false;
      }
    },
    async handleBankCardSelect() {
      try {
        this.$store.commit("HANDLE_ACCOUNT_SHOWING_PAGE", "select-sign-in-type");
        this.$store.commit("SET_SELECTED_CARD", this.selectedBankCard);
        await this.getSelectedCardDetail();
      } catch (error) {
        throw error;
      }
    },
    async handleBankCardChange() {
      try {
        this.$store.commit("HANDLE_ACCOUNT_SHOWING_PAGE", "change-card");
        this.$store.commit("SET_SELECTED_CARD", this.selectedBankCard);
        await this.getSelectedCardDetail();
      } catch (error) {
        throw error;
      }
    },
    async getSelectedCardDetail() {
      await this.$store.dispatch("SetSelectedCardDetail");
      await this.$store.dispatch("SetWorker");
    },
    handleCurrentChange(val) {
      this.selectedBankCard = val;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";

.bank-card-search {
  &__body {
    font-size: $fontBase;
  }
  &__prompt {
    font-size: $fontBase;
    text-align: center;
    // FIXME:
    margin: 58px 0 0;
  }
  &__footer {
    margin-top: 16px;
    text-align: center;
    &-button {
      width: 33%;
    }
  }
}

.el-form {
  margin: 8px 0;
  &-item {
    margin: 0;
  }
}
</style>