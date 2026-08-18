/**
 * Validation middleware for project operations
 */

function validateProject(req, res, next) {
  const { title, description } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Request body is required'
    });
  }

  if (title === undefined || title === null || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be a non-empty string'
    });
  }

  if (description === undefined || description === null || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Description is required and must be a non-empty string'
    });
  }

  const { technologies, project_link, github_link } = req.body;

  if (technologies !== undefined && typeof technologies !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Technologies must be a string'
    });
  }

  if (project_link !== undefined && typeof project_link !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Project link must be a string'
    });
  }

  if (github_link !== undefined && typeof github_link !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'GitHub link must be a string'
    });
  }

  req.body.title = title.trim();
  req.body.description = description.trim();
  if (technologies) req.body.technologies = technologies.trim();
  if (project_link) req.body.project_link = project_link.trim();
  if (github_link) req.body.github_link = github_link.trim();

  next();
}

module.exports = validateProject;
