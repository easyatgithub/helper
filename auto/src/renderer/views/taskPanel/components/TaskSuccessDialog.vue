<template>
  <el-dialog
    title="Mark Task as Success"
    :visible="app.task.isShowMarkAsSuccessDialog"
    width="80%"
    @close="closeDialog"
  >
    <el-form
      ref="taskSuccessForm"
      :model="form"
      :rules="rules"
      label-position="right"
      @submit.native.prevent
    >
      <el-form-item
        label="Bank Charge"
        label-width="120px"
        prop="transferFee"
      >
        <el-input
          v-model.number="form.transferFee"
          type="number"
        />
      </el-form-item>
      <el-form-item
        label="Note"
        label-width="120px"
      >
        <el-input
          v-model="form.note"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="success"
        size="small"
        :loading="isHandlingSuccess"
        @click="handleConfirm"
      >Confirm</el-button>
      <el-button
        size="small"
        @click="closeDialog"
      >Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "TaskSuccessDialog",
  data() {
    return {
      isHandlingSuccess: false,
      form: {
        transferFee: "0",
        note: "",
      },
      rules: {
        transferFee: [{ required: true, trigger: "blur" }],
      },
    };
  },
  computed: {
    app() {
      return this.$store.state.app;
    },
    task() {
      return this.$store.state.task;
    },
  },
  methods: {
    handleConfirm() {
      this.$refs.taskSuccessForm.validate(async valid => {
        if (valid) {
          await this.setTaskAsSuccess();
        } else {
          return false;
        }
      });
    },
    async setTaskAsSuccess() {
      try {
        this.isHandlingSuccess = true;
        // If true, means handle current task
        const isHandleCurrentTask = this.task.selectedDataForAPI === this.task.dataForAPI;

        await this.$store.dispatch("MarkTaskSuccess", {
          isHandleCurrentTask,
          transferFee: this.form.transferFee,
          note: this.form.note,
        });

        this.$message.success("Task has been mark as success");
        this.closeDialog();
      } catch (error) {
        this.$message.error(error.toString());
      } finally {
        this.isHandlingSuccess = false;
      }
    },
    closeDialog() {
      this.$store.commit("HANDLE_MARK_AS_SUCCESS_DIALOG", false);
      this.$store.commit("HANDLE_TASK_HANDLING", false);

      this.form = {
        transferFee: "0",
        note: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>