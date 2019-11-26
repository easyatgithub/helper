import {
  getAllTasks,
  lockTask,
  unlockTask,
  getTaskDetail,
  markTaskSuccess,
  checkIfExecuted,
  createExecuteRecord,
  getTaskFromToolByID,
  createTaskToTool,
  markTaskToConfirm,
  markTaskFail,
} from "../../api/task";
import { selectTaskStatus } from "../../utils/persistentState";
import { asyncForEach } from "../../utils/asyncForEach";

const task = {
  state: {
    list: [],
    lastSelected: {},
    selected: null,
    selectedDataForAPI: {}, // this is use for send the api of mark success
    dataForAPI: {}, // this is use for send the api of mark success
  },

  mutations: {
    SET_TASK_LIST: (state, tasks) => {
      state.list = tasks;
    },
    SET_LAST_SELECTED_DATA: (state, task) => {
      state.lastSelected = task;
    },
    SET_SELECTED_DATA: (state, task) => {
      state.selected = task;
    },
    SET_TOOL_INFORMATION_TO_SELECTED_DATA: (state, toolInformation) => {
      state.selected.toolID = toolInformation.id;
      state.selected.toolStatus = toolInformation.status;
    },
    // This for intergrate with weird api of leepay
    SET_DATA_FOR_API: (state, data) => {
      state.dataForAPI = data;
    },
    SET_SELECTED_DATA_FOR_API: (state, data) => {
      state.selectedDataForAPI = data;
    },
  },

  actions: {
    async GetAllTasks({ commit, getters }) {
      commit("HANDLE_TASK_FETCHING", true);
      try {
        var result = await getAllTasks(getters.card.current.id);
        await asyncForEach(result.data.value, async task => {
          var taskInformation = await getTaskFromToolByID(task.id, getters.app.platform);
          task.toolID = taskInformation.data.id || "";
          task.toolStatus = taskInformation.data.status || "to-process";
        });
        commit("SET_TASK_LIST", result.data.value);
        commit("SET_LOG", {
          level: "info",
          message: "Fetch data success",
        });
      } catch (error) {
        throw new Error("Get all tasks fail");
      } finally {
        commit("HANDLE_TASK_FETCHING", false);
      }
    },
    async SetTaskInfomationToTool({ commit, getters }) {
      const taskID = getters.task.dataForAPI.id;
      const platform = getters.app.platform;
      try {
        var taskInformation = await getTaskFromToolByID(taskID, platform);
        if (!taskInformation.data) {
          taskInformation = await createTaskToTool({
            taskID: taskID,
            platform: platform,
            merchant: getters.task.dataForAPI.merchantNameString,
            cardCode: getters.task.dataForAPI.bankAcctCode,
            amount: getters.task.selected.requestAmount,
            payee: getters.task.selected.receiverName,
            payeeBank: getters.task.selected.bank.englishName,
            payeeAccount: getters.task.selected.bank.cardNumber,
            operator: getters.name,
            status: "processing",
            remark: "Create by bank-auto-transfer",
          });
        }
        commit("SET_TOOL_INFORMATION_TO_SELECTED_DATA", taskInformation.data);
      } catch (error) {
        throw error;
      }
    },
    async GetAndSetSelectedTaskDetail(
      { commit },
      { id, withdraw, amount, merchantNameString, requestTimeStr },
    ) {
      try {
        const taskId = id;
        const withdrawId = withdraw.id;
        var result = await getTaskDetail(taskId, withdrawId);
        const data = result.data.value;

        var taskDetail = {
          id: taskId,
          merchantName: merchantNameString,
          requestAmount: amount,
          requestTime: requestTimeStr,
          receiverName: data.cardName,
          bank: {
            chineseName: data.offeredBank.bankChName,
            englishName: data.offeredBank.bankEnName,
            branch: data.cardBranch,
            province: data.cardProvince,
            city: data.cardCity,
            cardNumber: data.cardNum,
          },
        };
        commit("SET_SELECTED_DATA", taskDetail);
      } catch (error) {
        throw error;
      }
    },
    async LockSelectedTask(_, taskId) {
      try {
        var result = await lockTask(taskId);
        return result.data.success;
      } catch (error) {
        throw error;
      }
    },
    async UnlockSelectedTask(_, taskID) {
      try {
        var result = await unlockTask(taskID);
        return result.data.success;
      } catch (error) {
        throw error;
      }
    },
    async MarkTaskSuccess({ dispatch, getters }, { isHandleCurrentTask, transferFee, note }) {
      try {
        var dataForAPI = { ...getters.task.dataForAPI };
        dataForAPI.newCharge = transferFee;
        dataForAPI.remark = note;
        var result = await markTaskSuccess(dataForAPI);
        if (result.data.success) {
          await dispatch("MoveCurrentTaskToLast", { isHandleCurrentTask, status: "success" });
          await dispatch("GetAllTasks");
        } else {
          throw new Error("Mark task as success fail, please contact admin");
        }
      } catch (error) {
        throw error;
      }
    },
    async MarkTaskFail({ dispatch, getters }, { isHandleCurrentTask, reason }) {
      try {
        const dataForAPI = { ...getters.task.dataForAPI };
        dataForAPI.remark = reason;
        var result = await markTaskFail(dataForAPI);
        if (result.data.success) {
          // Check if fail or re-assign
          await dispatch("MoveCurrentTaskToLast", {
            isHandleCurrentTask,
            status: reason === "re-assign" ? "re-assign" : "fail",
          });
          await dispatch("GetAllTasks");
        } else {
          throw new Error("Mark task as fail error, please contact admin");
        }
      } catch (error) {
        throw error;
      }
    },
    async MarkTaskToConfirm({ dispatch, getters }, { isHandleCurrentTask, taskID }) {
      try {
        var platform = getters.app.platform;
        var operator = getters.name;
        const result = await markTaskToConfirm(taskID, {
          platform,
          status: "to-confirm",
          operator,
        });
        if (result.status === 200) {
          await dispatch("MoveCurrentTaskToLast", { isHandleCurrentTask, status: "to-confirm" });
          await dispatch("GetAllTasks");
        }
      } catch (error) {
        throw new Error("Mark task as to confirm fail, please contact admin");
      }
    },
    async CheckTaskExecuted({ getters }) {
      try {
        // Check local
        var result = await selectTaskStatus(getters.task.dataForAPI.taskId);
        if (result.length > 0) return result;

        // Check remote
        var remoteResult = await checkIfExecuted(getters.task.selected.toolID);
        return remoteResult.data;
      } catch (error) {
        throw error;
      }
    },
    async CreateTaskExecuteRecord({ getters }, reason) {
      try {
        var toolID = getters.task.selected.toolID;
        await createExecuteRecord(toolID, {
          operateType: "execute",
          operator: getters.name,
          note: reason,
        });
      } catch (error) {
        throw error;
      }
    },
    async MoveCurrentTaskToLast({ commit, dispatch, getters }, { isHandleCurrentTask, status }) {
      // Clear selected task
      if (isHandleCurrentTask) {
        var selectedTask = { ...getters.task.selected };
        selectedTask.toolStatus = status;
        if (selectedTask) commit("SET_LAST_SELECTED_DATA", selectedTask);

        commit("SET_SELECTED_DATA", null);
        commit("SET_DATA_FOR_API", null);
        commit("SET_SELECTED_DATA_FOR_API", null);
      }

      await Promise.all([dispatch("GetCurrentCardBoBalance"), dispatch("GetAllTasks")]).catch(
        error => {
          throw error;
        },
      );
    },
    // This for unset everything
    async UnsetTask({ commit }) {
      commit("SET_LAST_SELECTED_DATA", null);
      commit("SET_SELECTED_DATA", null);
      commit("SET_DATA_FOR_API", null);
      commit("SET_SELECTED_DATA_FOR_API", null);
    },
  },
};

export default task;
