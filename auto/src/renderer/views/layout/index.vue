<template>
  <div>
    <top-header />
    <el-tabs
      v-model="app.showingTab"
      type="border-card"
      class="tabs"
    >
      <el-tab-pane
        name="accounts"
        label="Accounts"
      >
        <account-panel />
      </el-tab-pane>
      <el-tab-pane
        name="tasks"
        :label="taskPanelLabel"
        :disabled="!app.task.isVisible"
      >
        <task-panel />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TopHeader from "./components/TopHeader";
import AccountPanel from "@/views/accountPanel";
import TaskPanel from "@/views/taskPanel";

export default {
  name: "Layout",
  components: {
    AccountPanel,
    TaskPanel,
    TopHeader,
  },
  data() {
    return {
      taskPanelLabel: "Tasks",
    };
  },
  computed: {
    ...mapGetters(["app", "card", "task"]),
  },
  watch: {
    "task.list"() {
      this.$nextTick(() => {
        if (this.task.list) {
          const totalTasks = this.task.list.length;
          const processingTasks = this.task.list.filter(task => task.toolStatus === "processing").length;
          this.taskPanelLabel = `Tasks ( total: ${totalTasks} / processing: ${processingTasks} )`;
        }
      });
    },
  },
  methods: {},
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "../../styles/variables.scss";

.tabs {
  margin: 8px 8px 0;
}
.account-title {
  font-size: $fontBase;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e2e2;
  margin-bottom: 8px;
}
</style>
