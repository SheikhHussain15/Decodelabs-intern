const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'database.sqlite');

let db;

async function connect() {
  try {
    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }

    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA foreign_keys = ON');

    console.log('Connected to SQLite database');
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error.message);
    throw error;
  }
}

function getConnection() {
  if (!db) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return db;
}

function save() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function close() {
  if (db) {
    save();
    db.close();
    console.log('Database connection closed');
  }
}

function initializeSchema() {
  const db = getConnection();

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      technologies TEXT DEFAULT '',
      project_link TEXT DEFAULT '',
      github_link TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  save();
  console.log('Database schema initialized');
}

module.exports = {
  connect,
  getConnection,
  save,
  close,
  initializeSchema
};