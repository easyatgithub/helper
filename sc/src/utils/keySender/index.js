const { execSync } = require('child_process');

export const KeyEnum = {
  TAB: 'VK_TAB',
  RETURN: 'VK_RETURN',
};

Object.freeze(KeyEnum);

export async function sendText(text) {
  try {
    await execSync(`KeySender.exe "${text}"`, { cwd: 'src/utils/keySender' });
  } catch (error) {
    throw error;
  }
}

export async function sendKey(key) {
  try {
    await execSync(`KeySender.exe "${key}"`, { cwd: 'src/utils/keySender' });
  } catch (error) {
    throw error;
  }
}
