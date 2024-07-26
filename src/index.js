import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import FileManager from './fileManager.js';
import RequestHandler from './requestHandler.js';
import Server from './server.js';

// Helper functions to get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the directory to store data files in the root directory
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const fileManager = new FileManager(DATA_DIR);
const requestHandler = new RequestHandler(fileManager);
const server = new Server(process.env.PORT, requestHandler);

server.start();

export default server;
