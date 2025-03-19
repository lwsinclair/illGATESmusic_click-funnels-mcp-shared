import dotenv from 'dotenv';
dotenv.config();
import { MCPServer } from 'mcp-framework';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
console.error(`Project root: ${projectRoot}`);

// Create required directories
const logsDir = path.join(projectRoot, 'logs');
const toolsDir = path.join(projectRoot, 'tools');
const promptsDir = path.join(projectRoot, 'prompts');
const resourcesDir = path.join(projectRoot, 'resources');

[logsDir, toolsDir, promptsDir, resourcesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.error(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Override logging environment variables with absolute paths
process.env.MCP_LOG_DIR = logsDir;

// Create the MCP server instance with absolute paths
const server = new MCPServer({
  name: 'clickfunnels-mcp-framework',
  version: '1.0.0',
  basePath: projectRoot
});

// Start the server
console.error('Starting MCP server...');
server.start();

// Handle process termination
process.on('SIGINT', () => {
  console.error('Shutting down server...');
  server.stop().then(() => {
    console.error('Server stopped');
    process.exit(0);
  });
});

// Keep process alive
process.stdin.resume();