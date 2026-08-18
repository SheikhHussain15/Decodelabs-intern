require('dotenv').config();
const express = require('express');
const path = require('path');
const projectsRouter = require('./routes/projects');
const { connect, initializeSchema, close } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS middleware for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..')));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
});

// API Routes
app.use('/api/projects', projectsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Developer Portfolio API - Project 3',
    description: 'Database Integration and CRUD Operations',
    endpoints: {
      projects: '/api/projects'
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server after database is ready
async function startServer() {
  try {
    await connect();
    initializeSchema();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Endpoints:');
      console.log('  GET    /api/projects      - Get all projects');
      console.log('  GET    /api/projects/:id  - Get project by ID');
      console.log('  POST   /api/projects      - Create a new project');
      console.log('  PUT    /api/projects/:id  - Update a project');
      console.log('  DELETE /api/projects/:id  - Delete a project');
    });

    process.on('SIGINT', () => {
      console.log('\nShutting down server...');
      server.close(() => {
        close();
        console.log('Server stopped');
        process.exit(0);
      });
    });

    process.on('SIGTERM', () => {
      console.log('\nShutting down server...');
      server.close(() => {
        close();
        console.log('Server stopped');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;