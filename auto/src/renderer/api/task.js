import moment from "moment";
import request from "@/utils/request";
import requestRisk from "@/utils/requestRisk";

/**
 *
 * @param {number} cardId
 */
export function getAllTasks(cardId) {
  return request({
    url: "/ps-ops-console/api/withdraw/searchWithdrawForVendorView",
    method: "POST",
    params: {
      pageSize: 50,
      pageNo: 1,
      sortOrder: "",
    },
    data: {
      bankAcctId: cardId,
      dateType: "requestDate",
      dateFrom: +moment()
        .startOf("day")
        .subtract(1, "hour"),
      dateTo: +moment().endOf("day"),
      durationFrom: null,
      durationTo: null,
      remarks: "",
      payeeName: "",
      processBy: "",
      requestAmtFrom: null,
      requestAmtTo: null,
      status: "I",
    },
  });
}

export function getTaskDetail(taskId, withdrawId) {
  return request({
    url: "/ps-ops-console/api/withdraw/loadWithdrawInfo",
    method: "GET",
    params: {
      withdrawId,
      payDetailId: taskId,
    },
  });
}

export function lockTask(taskId) {
  return request({
    url: "/ps-ops-console/api/task/lock",
    method: "GET",
    params: {
      taskId,
    },
  });
}

export function unlockTask(taskId) {
  return request({
    url: "/ps-ops-mgmt/api/subsystem/workflow/task/unlock",
    method: "POST",
    data: {
      taskId,
    },
  });
}

export function markTaskSuccess(data) {
  return request({
    url: "/ps-ops-console/api/withdraw/markAsSuccessPaymentDetail",
    method: "POST",
    data,
  });
}

export function markTaskFail(data) {
  return request({
    url: "/ps-ops-console/api/withdraw/markAsFailPaymentDetail",
    method: "POST",
    data,
  });
}

/**
 *
 * @param {number} taskID
 * @param {Object} data
 * @param {string} data.platform
 * @param {string} data.status
 * @param {string} data.operator
 */
export function markTaskToConfirm(taskID, data) {
  return requestRisk({
    url: `/task/${taskID}/status`,
    method: "PATCH",
    data,
  });
}

export function getTaskFromToolByID(taskId, platform) {
  return requestRisk({
    url: `/task/${taskId}`,
    method: "GET",
    params: {
      platformName: platform,
    },
  });
}
/**
 *
 * @param {Object} data
 * @param {number} data.taskID
 * @param {string} data.platform
 * @param {string} data.merchant
 * @param {string} data.cardCode
 * @param {string} data.amount
 * @param {string} data.payee
 * @param {string} data.payeeBank
 * @param {string} data.payeeAccount
 * @param {string} data.operator
 * @param {string} data.status
 * @param {string} data.remark
 */
export function createTaskToTool(data) {
  return requestRisk({
    url: `/task`,
    method: "POST",
    data,
  });
}

/**
 * Check if task has been excuted before
 */
export function checkIfExecuted(toolID) {
  return requestRisk({
    url: `/task/${toolID}/executed`,
    method: "GET",
  });
}

/**
 * Create a task execute record
 * @param {Object} data
 * @param {string} data.operateType
 * @param {string} data.operator
 * @param {string} data.note
 */
export function createExecuteRecord(id, data) {
  return requestRisk({
    url: `/task/${id}/detail`,
    method: "POST",
    data,
  });
}
