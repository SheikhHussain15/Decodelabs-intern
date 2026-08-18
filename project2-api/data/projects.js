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
  return parseRows(db.exec('SELECT * FROM projects ORDER BY created_at DESC'));
}

function getById(id) {
  const db = getConnection();
  const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  stmt.bind([id]);

  if (stmt.step()) {
    const columns = stmt.getColumnNames();
    const values = stmt.get();
    stmt.free();

    const project = {};
    columns.forEach((col, i) => { project[col] = values[i]; });
    return project;
  }

  stmt.free();
  return null;
}

function create(projectData) {
  const db = getConnection();
  const { title, description, technologies, project_link, github_link } = projectData;

  const stmt = db.prepare(
    'INSERT INTO projects (title, description, technologies, project_link, github_link) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run([title, description, technologies || '', project_link || '', github_link || '']);
  stmt.free();

  const newId = parseOne(db.exec('SELECT last_insert_rowid() as id')).id;
  save();

  return getById(newId);
}

function update(id, updates) {
  const db = getConnection();
  const existingProject = getById(id);
  if (!existingProject) return null;

  const { title, description, technologies, project_link, github_link } = updates;

  const stmt = db.prepare(
    `UPDATE projects SET 
      title = ?, 
      description = ?, 
      technologies = ?, 
      project_link = ?, 
      github_link = ?, 
      updated_at = datetime('now') 
    WHERE id = ?`
  );
  stmt.run([title, description, technologies || '', project_link || '', github_link || '', id]);
  stmt.free();
  save();

  return getById(id);
}

function remove(id) {
  const db = getConnection();
  const existingProject = getById(id);
  if (!existingProject) return false;

  const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
  stmt.run([id]);
  stmt.free();
  save();
  return true;
}

module.exports = { getAll, getById, create, update, remove };
