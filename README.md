# Developer Portfolio - Project 3

A personal developer portfolio website with database integration and CRUD operations for managing projects.

## Features

- Responsive developer portfolio design
- Dynamic project display from database
- Full CRUD operations for project management
- Clean navigation with mobile support
- Contact form with validation
- Modern, professional styling

## Technologies Used

**Frontend:**
- HTML5
- CSS3 (Flexbox, Grid, CSS Variables)
- Vanilla JavaScript (ES6)

**Backend:**
- Node.js
- Express.js
- SQLite (via sql.js)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm

### Setup

1. Navigate to the backend directory:
   ```bash
   cd project2-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the `project2-api` directory:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_PATH=./data/database.sqlite
```

## Running the Project

1. Start the backend server:
   ```bash
   cd project2-api
   npm start
   ```

2. Open the portfolio in your browser:
   - Portfolio: `http://localhost:3000`
   - Management: `http://localhost:3000/manage.html`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| GET | /api/projects/:id | Get a single project |
| POST | /api/projects | Create a new project |
| PUT | /api/projects/:id | Update a project |
| DELETE | /api/projects/:id | Delete a project |

### Project Schema

```json
{
  "id": 1,
  "title": "Project Name",
  "description": "Project description",
  "technologies": "HTML, CSS, JavaScript",
  "project_link": "https://example.com",
  "github_link": "https://github.com/...",
  "created_at": "2026-01-01 00:00:00",
  "updated_at": "2026-01-01 00:00:00"
}
```

## Project Structure

```
Decodelabs/
├── index.html          # Portfolio page
├── style.css           # Styles
├── script.js           # Portfolio JavaScript
├── manage.html         # Project management page
├── manage.js           # Management JavaScript
└── project2-api/
    ├── server.js       # Express server
    ├── config/
    │   └── database.js # SQLite database setup
    ├── data/
    │   └── projects.js # Project data operations
    ├── middleware/
    │   └── validateProject.js
    └── routes/
        └── projects.js # API routes
```

## Portfolio Sections

1. **Home** - Introduction with developer name and role
2. **About** - Background and interests
3. **Skills** - Technical skills display
4. **Projects** - Dynamic projects from database
5. **Contact** - Contact form with validation
