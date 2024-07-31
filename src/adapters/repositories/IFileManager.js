class IFileManager {
    getTableFilePath(tableName) {
        throw new Error("Method 'getTableFilePath()' must be implemented.");
    }

    readFile(filePath) {
        throw new Error("Method 'readFile()' must be implemented.");
    }

    writeFile(filePath, data) {
        throw new Error("Method 'writeFile()' must be implemented.");
    }

    deleteFile(filePath) {
        throw new Error("Method 'deleteFile()' must be implemented.");
    }
}

export default IFileManager;
