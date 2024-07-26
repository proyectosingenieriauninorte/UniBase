import Entry from '../../entities/entry.js';

class DataRepository {
    constructor(fileManager) {
        this.fileManager = fileManager;
    }

    async storeData(tableName, data) {
        const filePath = this.fileManager.getTableFilePath(tableName);
        let tableData = [];

        try {
            tableData = await this.fileManager.readFile(filePath);
        } catch (err) {
            // File not found, proceed with empty tableData
        }

        const entry = new Entry(data);
        tableData.push(entry);

        await this.fileManager.writeFile(filePath, tableData);

        return entry.entry_id;
    }

    async getAllData(tableName) {
        const filePath = this.fileManager.getTableFilePath(tableName);
        let tableData = [];

        try {
            tableData = await this.fileManager.readFile(filePath);
        } catch (err) {
            // File not found, return empty array
        }

        return tableData;
    }

    async getDataByEntryId(tableName, entryId) {
        const filePath = this.fileManager.getTableFilePath(tableName);
        const tableData = await this.fileManager.readFile(filePath);

        return tableData.find(item => item.entry_id === entryId);
    }

    async updateData(tableName, entryId, newData) {
        const filePath = this.fileManager.getTableFilePath(tableName);
        let tableData = await this.fileManager.readFile(filePath);

        const entryIndex = tableData.findIndex(item => item.entry_id === entryId);
        if (entryIndex === -1) {
            throw new Error('Entry ID not found');
        }

        tableData[entryIndex].data = newData;

        await this.fileManager.writeFile(filePath, tableData);

        return tableData[entryIndex];
    }

    async deleteDataByEntryId(tableName, entryId) {
        const filePath = this.fileManager.getTableFilePath(tableName);
        let tableData = await this.fileManager.readFile(filePath);

        const newTableData = tableData.filter(item => item.entry_id !== entryId);

        await this.fileManager.writeFile(filePath, newTableData);

        return true;
    }

    async deleteTable(tableName) {
        const filePath = this.fileManager.getTableFilePath(tableName);
        await this.fileManager.deleteFile(filePath);

        return true;
    }
}

export default DataRepository;
