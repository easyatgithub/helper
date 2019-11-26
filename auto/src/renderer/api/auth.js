import request from "@/utils/request";

export function login(username, password) {
  return request({
    url: "/ps-ops-mgmt/api/operator_sessions",
    method: "POST",
    data: {
      operatorName: username,
      password,
    },
  });
}

export function logout() {
  return request({
    url: "/ps-ops-mgmt/api/operator_sessions/logout",
    method: "DELETE",
  });
}
