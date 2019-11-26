const { execSync } = require("child_process");

export const KeyEnum = {
  TAB: "VK_TAB",
  RETURN: "VK_RETURN",
  "ALT+TAB": "VK_ALT_TAB",
};

Object.freeze(KeyEnum);

export async function sendText(text, waitingTime) {
  try {
    execSync(`KeySender.exe "${text}" "${waitingTime ? waitingTime : 3000}"`, {
      shell: false,
      cwd:
        process.env.NODE_ENV === "production" ? process.resourcesPath + "/keySender" : "keySender",
    });
  } catch (error) {
    throw error;
  }
}

export async function sendKey(key, waitingTime) {
  try {
    execSync(`KeySender.exe "${key}" "${waitingTime ? waitingTime : 3000}"`, {
      shell: false,
      cwd:
        process.env.NODE_ENV === "production" ? process.resourcesPath + "/keySender" : "keySender",
    });
  } catch (error) {
    throw error;
  }
}
