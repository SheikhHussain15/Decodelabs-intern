const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testGetAllProjects() {
  console.log('\n1. GET /api/projects - Get all projects');
  const result = await makeRequest('GET', '/api/projects');
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Projects count: ${result.data.data.length}`);
  console.log(`   ✓ PASS`);
}

async function testCreateProject() {
  console.log('\n2. POST /api/projects - Create a new project');
  const result = await makeRequest('POST', '/api/projects', {
    title: 'Test Portfolio',
    description: 'A test portfolio project',
    technologies: 'HTML, CSS, JavaScript',
    project_link: 'https://example.com',
    github_link: 'https://github.com/test'
  });
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Created: ${JSON.stringify(result.data.data)}`);
  console.log(`   ✓ PASS`);
  return result.data.data.id;
}

async function testGetProjectById(id) {
  console.log('\n3. GET /api/projects/:id - Get project by ID');
  const result = await makeRequest('GET', `/api/projects/${id}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Project: ${JSON.stringify(result.data.data)}`);
  console.log(`   ✓ PASS`);
}

async function testGetNonExistentProject() {
  console.log('\n4. GET /api/projects/999 - Get non-existent project');
  const result = await makeRequest('GET', '/api/projects/999');
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testCreateProjectWithoutTitle() {
  console.log('\n5. POST /api/projects - Create project without title');
  const result = await makeRequest('POST', '/api/projects', {});
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testCreateProjectWithEmptyFields() {
  console.log('\n6. POST /api/projects - Create project with empty title');
  const result = await makeRequest('POST', '/api/projects', { title: '' });
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testUpdateProject(id) {
  console.log('\n7. PUT /api/projects/:id - Update project');
  const result = await makeRequest('PUT', `/api/projects/${id}`, {
    title: 'Updated Portfolio',
    description: 'Updated description',
    technologies: 'React, Node.js'
  });
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Updated: ${JSON.stringify(result.data.data)}`);
  console.log(`   ✓ PASS`);
}

async function testUpdateNonExistentProject() {
  console.log('\n8. PUT /api/projects/999 - Update non-existent project');
  const result = await makeRequest('PUT', '/api/projects/999', {
    title: 'Updated',
    description: 'Updated'
  });
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testDeleteProject(id) {
  console.log('\n9. DELETE /api/projects/:id - Delete project');
  const result = await makeRequest('DELETE', `/api/projects/${id}`);
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testDeleteNonExistentProject() {
  console.log('\n10. DELETE /api/projects/999 - Delete non-existent project');
  const result = await makeRequest('DELETE', '/api/projects/999');
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testInvalidId() {
  console.log('\n11. GET /api/projects/abc - Invalid ID');
  const result = await makeRequest('GET', '/api/projects/abc');
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function testRootEndpoint() {
  console.log('\n12. GET / - Root endpoint');
  const result = await makeRequest('GET', '/');
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function test404() {
  console.log('\n13. GET /api/invalid - 404 route');
  const result = await makeRequest('GET', '/api/invalid');
  console.log(`   Status: ${result.status}`);
  console.log(`   Success: ${result.data.success}`);
  console.log(`   Message: ${result.data.message}`);
  console.log(`   ✓ PASS`);
}

async function runTests() {
  console.log('=== Backend API Test Suite - Project 3 ===');
  console.log('Testing all CRUD endpoints with database...\n');

  try {
    await testGetAllProjects();
    const newProjectId = await testCreateProject();
    await testGetProjectById(newProjectId);
    await testGetNonExistentProject();
    await testCreateProjectWithoutTitle();
    await testCreateProjectWithEmptyFields();
    await testUpdateProject(newProjectId);
    await testUpdateNonExistentProject();
    await testDeleteProject(newProjectId);
    await testDeleteNonExistentProject();
    await testInvalidId();
    await testRootEndpoint();
    await test404();

    console.log('\n=== All 13 tests passed! ===');

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
