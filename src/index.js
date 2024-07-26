import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import FileManager from './adapters/repositories/fileManager.js';
import DataManager from './usecase/dataManager.js';
import RequestHandler from './usecase/requestHandler.js';
import HttpController from './adapters/controllers/httpController.js';
import Server from './frameworks/server.js';

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
const dataManager = new DataManager(fileManager);
const requestHandler = new RequestHandler(dataManager);
const httpController = new HttpController(requestHandler);
const server = new Server(process.env.PORT, httpController);

server.start();

export default server;
