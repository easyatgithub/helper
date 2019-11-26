import moment from "moment";
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./state.db");

db.serialize(function() {
  // Check and create
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='task'", function(
    selectError,
    row,
  ) {
    if (row !== undefined) {
      console.log("table exists.");
    } else {
      console.log("creating table");
      db.run(
        "CREATE TABLE task (taskID INT, platform TEXT, reason TEXT, createBy TEXT, createAt TEXT)",
        function(createError) {
          if (createError) console.log(createError);
        },
      );
    }
  });
});

/**
 * Save task status in database
 * @param {number} taskID
 * @param {string} platform
 * @param {string} reason
 * @param {string} createBy
 */
export function saveTaskStatus(taskID, platform, reason, createBy) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO task (taskID, platform, reason,createBy, createAt) VALUES (?, ?, ?, ?, ?)`,
      [taskID, platform, reason, createBy, moment().format("YYYY-MM-DD hh:mm:ss")],
      error => {
        if (error) return reject(error);
        resolve();
      },
    );
  });
}

/**
 * Get task status in database
 * @param {number} taskID
 * @returns {Promise<[]>}
 */
export function selectTaskStatus(taskID) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT taskID, platform, reason, createAt FROM task WHERE taskID = ?",
      [taskID],
      (error, rows) => {
        if (error) return reject(error);
        resolve(rows);
      },
    );
  });
}
