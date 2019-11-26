export default {
  methods: {
    async lockTask(task) {
      var isTaskLockSuccess = await this.$store.dispatch("LockSelectedTask", task.taskId);
      if (!isTaskLockSuccess) throw new Error("Task has been assigned");
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
    /**
     * @param {Object} task - If task is null, means it was trigger by current task
     */
    async markAsSuccess(task) {
      this.$store.commit("HANDLE_TASK_HANDLING", true);
      if (task) {
        this.$store.commit("SET_DATA_FOR_API", task);
      } else {
        const selectedDataForAPI = this.$store.state.task.selectedDataForAPI;
        this.$store.commit("SET_DATA_FOR_API", selectedDataForAPI);
      }
      this.$store.commit("HANDLE_MARK_AS_SUCCESS_DIALOG", true);
    },
    async markAsFail(isHandleCurrentTask, task) {
      this.$store.commit("HANDLE_TASK_HANDLING", true);
      if (task) {
        this.$store.commit("SET_DATA_FOR_API", task);
      } else {
        const selectedDataForAPI = this.$store.state.task.selectedDataForAPI;
        this.$store.commit("SET_DATA_FOR_API", selectedDataForAPI);
      }

      try {
        await this.confirmMarkAsFail(isHandleCurrentTask);
      } catch (error) {
        return this.$store.commit("SET_CONSOLE", {
          message: error.toString(),
          level: "error",
        });
      } finally {
        this.$store.commit("HANDLE_TASK_HANDLING", false);
      }
    },
    confirmMarkAsFail(isHandleCurrentTask) {
      return this.$prompt("Please enter the reason what you want to mark this task as fail.", "", {
        inputPattern: /\S+/,
        inputErrorMessage: "The reason can't be empty",
      })
        .then(async ({ value }) => {
          await this.$store.dispatch("MarkTaskFail", { isHandleCurrentTask, reason: value });
          this.$message({
            showClose: true,
            message: "Task has been marked as fail",
            type: "success",
          });
          return true;
        })
        .catch(() => {
          return false;
        });
    },
    async markAsToConfirm(isHandleCurrentTask, task) {
      this.isHandlingToConfirm = true;
      this.$store.commit("HANDLE_TASK_HANDLING", true);
      try {
        await this.$store.dispatch("MarkTaskToConfirm", { isHandleCurrentTask, taskID: task.id });
      } catch (error) {
        throw error;
      } finally {
        this.isHandlingToConfirm = false;
      }
    },
    async markAsReassign(isHandleCurrentTask, task) {
      this.$store.commit("HANDLE_TASK_HANDLING", true);
      if (task) {
        this.$store.commit("SET_DATA_FOR_API", task);
      } else {
        const selectedDataForAPI = this.$store.state.task.selectedDataForAPI;
        this.$store.commit("SET_DATA_FOR_API", selectedDataForAPI);
      }

      this.$confirm("Are you sure you want to mark this task as re-assign", "", {
        type: "warning",
      })
        .then(async () => {
          try {
            if (!isHandleCurrentTask) await this.lockTask(task);

            await this.$store.dispatch("MarkTaskFail", {
              isHandleCurrentTask,
              reason: "re-assign",
            });
            this.$message({
              showClose: true,
              message: "Task has been marked as re-assign",
              type: "success",
            });
          } catch (error) {
            return this.$store.commit("SET_CONSOLE", {
              message: error.toString(),
              level: "error",
            });
          } finally {
            this.$store.commit("HANDLE_TASK_HANDLING", false);
          }
        })
        .catch(() => {
          this.$store.commit("HANDLE_TASK_HANDLING", false);
        });
    },
  },
};
