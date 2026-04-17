const fs = require('node:fs/promises');
const path = require('node:path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const defaultDb = {
  users: [],
  locations: [],
  notifications: [],
  passwordResetTokens: [],
  childAccessCodes: [],
  revokedTokens: [],
  deviceTokens: [],
  guardians: [],
  conversations: [],
  chatLogs: [],
  signupVerifications: [],
};

async function ensureDb() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf8');
  }
}

async function readDb() {
  await ensureDb();
  const content = await fs.readFile(DB_PATH, 'utf8');
  try {
    const parsed = JSON.parse(content);
    return {
      ...defaultDb,
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : [],
      locations: Array.isArray(parsed.locations) ? parsed.locations : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      passwordResetTokens: Array.isArray(parsed.passwordResetTokens) ? parsed.passwordResetTokens : [],
      childAccessCodes: Array.isArray(parsed.childAccessCodes) ? parsed.childAccessCodes : [],
      revokedTokens: Array.isArray(parsed.revokedTokens) ? parsed.revokedTokens : [],
      deviceTokens: Array.isArray(parsed.deviceTokens) ? parsed.deviceTokens : [],
      guardians: Array.isArray(parsed.guardians) ? parsed.guardians : [],
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      chatLogs: Array.isArray(parsed.chatLogs) ? parsed.chatLogs : [],
      signupVerifications: Array.isArray(parsed.signupVerifications) ? parsed.signupVerifications : [],
    };
  } catch {
    return { ...defaultDb };
  }
}

async function writeDb(nextDb) {
  await fs.writeFile(DB_PATH, JSON.stringify(nextDb, null, 2), 'utf8');
}

module.exports = {
  readDb,
  writeDb,
};
