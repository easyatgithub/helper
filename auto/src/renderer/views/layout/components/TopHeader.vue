<template>
  <div class="top-header__container">
    <div class="top-header__operator">
      <span>Operator:</span>
      <span style="font-weight: bold">{{ name }}</span>
    </div>
    <div class="top-header__auto-process">
      <el-checkbox
        v-model="task.isAutoProcess"
        :disabled="true"
      >Auto Process Task</el-checkbox>
    </div>
    <div class="top-header__dropdown">
      <el-dropdown
        trigger="click"
        @command="handleCommand"
      >
        <span class="el-dropdown-link">
          Settings
          <svg-icon icon-class="caret-down" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled>System</el-dropdown-item>
          <el-dropdown-item
            divided
            command="signOutSystem"
          >Sign Out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "TopHeader",
  data() {
    return {
      bankSearchVisible: false,
      waitingSecond: 5,
    };
  },
  computed: {
    ...mapGetters(["app", "name", "card", "task"]),
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "signOutSystem":
          this.signOutSystem();
          break;

        default:
          break;
      }
    },
    async signOutSystem() {
      await this.$store.dispatch("FedSignOut");
      await this.$store.dispatch("SignOut");
    },
  },
};
</script>

<style lang="scss">
@import "../../../styles/variables.scss";
.top-header {
  &__container {
    font-size: $fontBase;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    height: 49px;
    border-bottom: 1px solid #e2e2e2;
    padding: 0 8px;
  }
  &__operator {
    margin: 0 8px;
    flex-grow: 1;
  }
  &__auto-process {
    margin-right: 8px;
    order: 2;
  }
  &__dropdown {
    border-left: 1px solid #e2e2e2;
    padding-left: 8px;
    margin-right: 8px;
    order: 3;
  }
}
</style>