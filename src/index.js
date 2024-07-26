import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import FileManager from './adapters/repositories/fileManager.js';
import DataRepository from './adapters/repositories/dataRepository.js';
import StoreDataUseCase from './usecases/storeDataUseCase.js';
import GetAllDataUseCase from './usecases/getAllDataUseCase.js';
import GetDataByEntryIdUseCase from './usecases/getDataByEntryIdUseCase.js';
import UpdateDataUseCase from './usecases/updateDataUseCase.js';
import DeleteDataByEntryIdUseCase from './usecases/deleteDataByEntryIdUseCase.js';
import DeleteTableUseCase from './usecases/deleteTableUseCase.js';
import HttpController from './adapters/controllers/httpController.js';
import Server from './frameworks/server.js';

// Helper functions to get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the directory to store data files in the root directory
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure the data directory exists
try {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR);
    }
    console.log('Data directory is ready.');
} catch (error) {
    console.error('Failed to create or verify data directory:', error);
}

let fileManager, dataRepository, useCases, httpController, server;

try {
    fileManager = new FileManager(DATA_DIR);
    console.log('FileManager initialized.');
} catch (error) {
    console.error('Failed to initialize FileManager:', error);
}

try {
    dataRepository = new DataRepository(fileManager);
    console.log('DataRepository initialized.');
} catch (error) {
    console.error('Failed to initialize DataRepository:', error);
}

try {
    useCases = {
        storeData: new StoreDataUseCase(dataRepository),
        getAllData: new GetAllDataUseCase(dataRepository),
        getDataByEntryId: new GetDataByEntryIdUseCase(dataRepository),
        updateData: new UpdateDataUseCase(dataRepository),
        deleteDataByEntryId: new DeleteDataByEntryIdUseCase(dataRepository),
        deleteTable: new DeleteTableUseCase(dataRepository)
    };
    console.log('UseCases initialized.');
} catch (error) {
    console.error('Failed to initialize UseCases:', error);
}

try {
    httpController = new HttpController(useCases);
    console.log('HttpController initialized.');
} catch (error) {
    console.error('Failed to initialize HttpController:', error);
}

try {
    server = new Server(process.env.PORT || 3000, httpController);
    server.start();
    console.log('Server started.');
} catch (error) {
    console.error('Failed to start the server:', error);
}

export default server;
