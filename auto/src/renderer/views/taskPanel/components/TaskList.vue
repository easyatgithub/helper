<template>
  <div class="task-list__container">
    <div class="task-list__container-header">
      <div class="current-account">
        <span>Current Account:</span>
        <span style="font-weight: bold;">{{ card.currentDetail.accountCode || '' }}</span>
      </div>

      <div class="bo-balance">
        <span>BO Balance:</span>
        <span style="font-weight: bold;">{{ balanceInSystem }}</span>
        <span
          v-if="isFetchBoBalanceFail"
          style="color:#F56C6C"
        >
          <svg-icon icon-class="error" />Update Fail
        </span>
      </div>
      <div class="fetch-task">
        <el-button
          size="mini"
          :icon="fetchButton.icon"
          :type="fetchButton.type"
          :loading="app.task.isFetching"
          @click="handleFetch"
        >{{ app.task.fetchTimer }}s</el-button>
      </div>
    </div>
    <div class="task-list__container-body">
      <el-table
        ref="taskTable"
        v-loading="app.task.isFetching"
        :data="task.list"
        style="width: 100%"
        :height="tableHeight"
        size="mini"
        :stripe="true"
        :border="true"
        :row-class-name="selectedRowClass"
      >
        <el-table-column
          prop="id"
          label="Task ID"
          width="70"
          align="center"
        />
        <el-table-column
          label="Account Group"
          width="120"
          align="center"
        >
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">{{ card.currentDetail.channelGroup || ' - ' }}</template>
        </el-table-column>
        <el-table-column
          prop="merchantNameString"
          label="Merchant"
          align="center"
        />
        <!-- <el-table-column
          prop="receiver"
          label="Receiver"
          align="center"
        />-->
        <el-table-column
          prop="amount"
          label="Amount"
          width="100"
          header-align="center"
          align="right"
        >
          <template
            slot-scope="scope"
          >{{ new Intl.NumberFormat('zh-CN', { style:'currency' ,currency: 'CNY' }).format(scope.row.amount) }}</template>
        </el-table-column>
        <el-table-column
          label="Leepay Status"
          align="center"
        >
          <template slot-scope="scope">
            <div style="color:#C0C4CC;">
              <span v-if="scope.row.status === 'I'">processing</span>
              <span v-if="scope.row.status === 'P'">paid</span>
              <span v-if="scope.row.status === 'FC'">failed confirmation</span>
              <span v-if="scope.row.status === 'F'">failed</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="toolStatus"
          label="FT Status"
          align="center"
        />
        <el-table-column
          label="Assigned Time"
          align="center"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.requestTimeStr.split(' ')[1] }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="status"
          label="Process Duration"
          align="center"
          width="80"
        />-->
        <el-table-column
          label="Actions"
          width="160"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div style="display: flex; justify-content: space-around">
              <div>
                <el-button
                  v-if="scope.row.toolStatus!=='to-confirm'"
                  class="task-operator__button"
                  style="width:80px"
                  size="mini"
                  :disabled="isProcessButtonDisabled(scope.row)"
                  @click="handleRowSelect(scope.row)"
                >{{ scope.row.toolStatus==='processing'?'Reprocess':'Process' }}</el-button>
                <el-button
                  v-if="scope.row.toolStatus==='to-confirm'"
                  class="task-operator__button"
                  style="width:80px"
                  size="mini"
                  type="success"
                  :disabled="isSuccessButtonDisabled(scope.row)"
                  @click="markAsSuccess(scope.row)"
                >Success</el-button>
              </div>
              <div>
                <el-popover
                  :disabled="isMoreButtonDisabled(scope.row)"
                  trigger="click"
                  placement="left"
                  width="180"
                >
                  <el-row class="el-row--popover">
                    <el-col
                      v-if="isSuccessButtonVisible(scope.row)"
                      :span="24"
                      class="el-row--popover__el-col"
                    >
                      <el-button
                        class="el-row--popover__el-button"
                        @click="markAsSuccess(scope.row)"
                      >
                        <svg-icon
                          icon-class="check"
                          class="el-row--popover__el-button--icon"
                        />Success
                      </el-button>
                    </el-col>
                    <el-col
                      v-if="isFailButtonVisible(scope.row)"
                      :span="24"
                      class="el-row--popover__el-col"
                    >
                      <el-button
                        class="el-row--popover__el-button"
                        @click="markAsFail(false, scope.row)"
                      >
                        <svg-icon
                          icon-class="error"
                          class="el-row--popover__el-button--icon"
                        />Fail
                      </el-button>
                    </el-col>
                    <el-col
                      v-show="isToConfirmButtonVisible(scope.row)"
                      :span="24"
                      class="el-row--popover__el-col"
                    >
                      <el-button
                        class="el-row--popover__el-button"
                        @click="markAsToConfirm(false, scope.row)"
                      >
                        <svg-icon
                          icon-class="check-circle"
                          class="el-row--popover__el-button--icon"
                        />To Confirm
                      </el-button>
                    </el-col>
                    <el-col
                      v-if="isReassignButtonVisible(scope.row)"
                      :span="24"
                      class="el-row--popover__el-col"
                    >
                      <el-button
                        class="el-row--popover__el-button"
                        @click="markAsReassign(false, scope.row)"
                      >
                        <svg-icon
                          icon-class="unlock"
                          class="el-row--popover__el-button--icon"
                        />Re-assign
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-button
                    slot="reference"
                    :disabled="isMoreButtonDisabled(scope.row)"
                    class="task-operator__button"
                    size="mini"
                  >More</el-button>
                </el-popover>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <task-success-dialog />
  </div>
</template>

<script>
import * as moment from "moment";
import { mapGetters } from "vuex";
import TaskSuccessDialog from "./TaskSuccessDialog";
import { saveTaskStatus } from "../../../utils/persistentState";
import taskOperation from "../mixins/taskOperation";

export default {
  components: {
    TaskSuccessDialog,
  },
  mixins: [taskOperation],
  data() {
    return {
      fetchButton: {
        icon: "el-icon-refresh",
        type: "default",
      },
      fetchInvervalID: null,
      taskHandleType: 2,
      taskOptionVisible: [],
      taskDialogVisible: false,
      isFetchBoBalanceFail: false,
    };
  },
  computed: {
    ...mapGetters(["app", "card", "task", "name"]),
    selectedTask() {
      return this.task.selected;
    },
    tableHeight() {
      // top header, tab margin, tab content, info header, task detail, others
      return window.innerHeight - 50 - 16 - 30 - 65 - 198 - 73 - 45;
    },
    balanceInSystem() {
      if (this.card.currentDetail.balanceInSystem) {
        return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(
          this.card.currentDetail.balanceInSystem,
        );
      }
      return "-";
    },
  },
  watch: {
    "app.showingTab"() {
      if (this.app.showingTab === "tasks") {
        if (this.app.task.isFetchable && !this.app.task.isTaskHandling) this.handleFetch();
      }
    },
  },
  async beforeMount() {
    this.fetchInvervalID = setInterval(async () => {
      if (this.app.task.isFetchable) {
        if (this.app.task.isTaskHandling) {
          this.$store.commit("RESET_TASK_FETCH_TIMER", 9);
        } else if (this.app.task.fetchTimer === 0) {
          await this.handleFetch();
        } else {
          this.$store.commit("MINUS_TASK_FETCH_TIMER");
        }
      }
    }, 1 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.fetchInvervalID);
  },
  methods: {
    selectedRowClass({ row, rowIndex }) {
      if (this.selectedTask) {
        if (this.selectedTask.id === row.id) {
          return "executing-row";
        }
      }
      return "";
    },
    async handleFetch() {
      this.$store.commit("RESET_TASK_FETCH_TIMER", 9);
      try {
        await Promise.all([this.getBoBalance(), this.getTasks()]);
        this.fetchButton.type = "success";
      } catch (error) {
        this.fetchButton.type = "danger";
        this.$store.commit("SET_CONSOLE", { level: "error", message: error.message });
        return this.$store.commit("SET_TASK_LIST", []);
      }
    },
    async getBoBalance() {
      try {
        await this.$store.dispatch("GetCurrentCardBoBalance");
      } catch (error) {
        this.isFetchBoBalanceFail = true;
        throw error;
      }
    },
    async getTasks() {
      try {
        let scrollTop = this.$refs.taskTable.bodyWrapper.scrollTop;
        await this.$store.dispatch("GetAllTasks");
        this.$refs.taskTable.bodyWrapper.scrollTop = scrollTop;
      } catch (error) {
        throw error;
      }
    },
    async handleRowSelect(val) {
      await this.lockTask(val);

      this.$store.commit("SET_DATA_FOR_API", val);
      this.$store.commit("SET_SELECTED_DATA_FOR_API", val);
      await this.$store.dispatch("GetAndSetSelectedTaskDetail", val);
      await this.$store.dispatch("SetTaskInfomationToTool");
      val.toolStatus = "processing";

      var result = await this.$store.dispatch("CheckTaskExecuted");

      if (result.length > 0) {
        if (await this.confirmExecution(val.taskId, result)) {
          this.startTask();
        }
      } else {
        await this.recordExecutingTask(
          val.taskId,
          "leepay",
          "First time run, create by system.",
          this.name,
        );
        this.startTask();
      }
    },
    async unlockTask(task) {
      try {
        await this.$store.dispatch("UnlockSelectedTask", task.taskId);
        this.$message({
          message: `Task has been unlocked`,
          type: "success",
        });
        this.$store.commit("SET_CONSOLE", {
          message: `Task has been unlocked`,
          level: "info",
        });
      } catch (error) {
        this.$message({
          message: error.message,
          type: "error",
        });
        this.$store.commit("SET_CONSOLE", {
          message: error.message,
          level: "error",
        });
      }
    },
    async startTask() {
      try {
        await this.$store.dispatch("GoAndFillTransferInformation");
      } catch (error) {
        this.$store.commit("SET_CONSOLE", {
          message: error.message,
          level: "error",
        });
      }
    },
    confirmExecution(taskID, executedTasks) {
      var message = "Previous executed record:" + "<br>";
      executedTasks.forEach((executedTask, index) => {
        message +=
          `${index + 1}.` +
          `At <span style="font-weight:bold">${moment(executedTask.createAt).format(
            "HH:mm:ss",
          )}</span>` +
          `, Note: <span style="font-weight:bold">${executedTask.reason ||
            executedTask.note}</span>` +
          "<br>";
      });
      return this.$prompt(
        message +
          `<span style="color:#E6A23C">Please enter the reason what you want to run this task again:</span>`,
        executedTasks.message,
        {
          inputPattern: /\S+/,
          inputErrorMessage: "The reason can't be empty",
          type: "warning,",
          dangerouslyUseHTMLString: true,
        },
      )
        .then(async ({ value }) => {
          await this.recordExecutingTask(taskID, "leepay", value, this.name);
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    async recordExecutingTask(taskID, platform, reason, operator) {
      await saveTaskStatus(taskID, platform, reason, operator);
      await this.$store.dispatch("CreateTaskExecuteRecord", reason);
    },
    isMoreButtonDisabled(row) {
      if (row.status !== "I") return true;
      return false;
    },
    isProcessButtonDisabled(row) {
      if (row.status !== "I" || row.toolStatus === "to-confirm") return true;
      return false;
    },
    isSuccessButtonDisabled(row) {
      if (row.status !== "I") return true;
      return false;
    },
    isSuccessButtonVisible(row) {
      if (row.toolStatus === "to-process") {
        return false;
      }
      return true;
    },
    isFailButtonVisible(row) {
      if (row.toolStatus === "to-process") {
        return false;
      }
      return true;
    },
    isToConfirmButtonVisible(row) {
      if (row.toolStatus === "processing") {
        return true;
      }
      return false;
    },
    isReassignButtonVisible(row) {
      if (row.status !== "I") {
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../styles/variables.scss";

.task-list {
  &__container {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      margin-bottom: 15px;
      padding: 8px 16px;
      background-color: #f2f2f2;
      border-radius: 4px;

      .current-account {
        font-size: $fontBase;
      }

      .bo-balance {
        font-size: $fontBase;
      }

      .fetch-task {
        text-align: right;
      }
    }

    &-body {
      margin-top: 8px;
      .task-operator__button {
        padding: 6px 8px;
        margin: 0;
      }
    }
  }
}
.el-row--popover {
  &__el-col {
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
  &__el-button {
    width: 155px;
    text-align: left;
    &--icon {
      margin-right: 8px;
    }
  }
}
</style>

<style lang="scss">
.el-table .executing-row > td {
  background: rgb(240, 249, 235) !important;
}
</style>