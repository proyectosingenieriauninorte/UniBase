import fs from 'fs';
import path from 'path';

class FileManager {
    constructor(dataDir) {
        this.dataDir = dataDir;
    }

    getTableFilePath(tableName) {
        return path.join(this.dataDir, `${tableName}.json`);
    }

    readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(JSON.parse(data));
            });
        });
    }

    writeFile(filePath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }

    deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

export default FileManager;
