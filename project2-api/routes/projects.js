const express = require('express');
const router = express.Router();
const store = require('../data/projects');
const validateProject = require('../middleware/validateProject');

/**
 * GET /api/projects
 * Return all projects
 */
router.get('/', (req, res) => {
  try {
    const projects = store.getAll();
    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve projects'
    });
  }
});

/**
 * GET /api/projects/:id
 * Return a single project by ID
 */
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const project = store.getById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project retrieved successfully',
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve project'
    });
  }
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', validateProject, (req, res) => {
  try {
    const { title, description, technologies, project_link, github_link } = req.body;

    const newProject = store.create({
      title,
      description,
      technologies,
      project_link,
      github_link
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

/**
 * PUT /api/projects/:id
 * Update an existing project
 */
router.put('/:id', validateProject, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const { title, description, technologies, project_link, github_link } = req.body;

    const updatedProject = store.update(id, {
      title,
      description,
      technologies,
      project_link,
      github_link
    });

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    console.error('Error updating project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }

    const removed = store.remove(id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;
