const { getConnection, save } = require('../config/database');

function parseRows(results) {
  if (results.length === 0) return [];
  const { columns, values } = results[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

function parseOne(results) {
  const rows = parseRows(results);
  return rows.length > 0 ? rows[0] : null;
}

function getAll() {
  const db = getConnection();
  const tasks = parseRows(db.exec('SELECT * FROM tasks ORDER BY created_at DESC'));
  return tasks.map(t => ({ ...t, completed: Boolean(t.completed) }));
}

function getById(id) {
  const db = getConnection();
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  stmt.bind([id]);

  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    stmt.free();

    const task = {};
    columns.forEach((col, i) => { task[col] = values[i]; });
    task.completed = Boolean(task.completed);
    return task;
  }

  stmt.free();
  return null;
}

function create(taskData) {
  const db = getConnection();
  const { title, completed } = taskData;

  const stmt = db.prepare('INSERT INTO tasks (title, completed) VALUES (?, ?)');
  stmt.run([title, completed ? 1 : 0]);
  stmt.free();

  const newId = parseOne(db.exec('SELECT last_insert_rowid() as id')).id;
  save();

  return getById(newId);
}

function update(id, updates) {
  const db = getConnection();
  const { title, completed } = updates;

  const existingTask = getById(id);
  if (!existingTask) return null;

  const stmt = db.prepare('UPDATE tasks SET title = ?, completed = ?, updated_at = datetime(\'now\') WHERE id = ?');
  stmt.run([title, completed ? 1 : 0, id]);
  stmt.free();
  save();

  return getById(id);
}

function remove(id) {
  const db = getConnection();

  const existingTask = getById(id);
  if (!existingTask) return false;

  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run([id]);
  stmt.free();
  save();
  return true;
}

module.exports = { getAll, getById, create, update, remove };