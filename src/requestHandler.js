class RequestHandler {
    constructor(fileManager) {
        this.fileManager = fileManager;
    }

    parseBody(req) {
        return new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body ? JSON.parse(body) : {});
            });
        });
    }

    async handleStoreData(req, res) {
        try {
            const { table_name, data } = await this.parseBody(req);
            const filePath = this.fileManager.getTableFilePath(table_name);
            let tableData = [];

            try {
                tableData = await this.fileManager.readFile(filePath);
            } catch (err) {
                // File not found, proceed with empty tableData
            }

            const entry_id = Date.now().toString(); // Generate a unique entry ID based on the current timestamp
            tableData.push({ ...data, entry_id });

            await this.fileManager.writeFile(filePath, tableData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ entry_id }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to store data' }));
        }
    }

    async handleGetAllData(req, res, tableName) {
        try {
            const filePath = this.fileManager.getTableFilePath(tableName);
            let tableData = [];

            try {
                tableData = await this.fileManager.readFile(filePath);
            } catch (err) {
                // File not found, return empty array
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: tableData }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve data' }));
        }
    }

    async handleGetDataByEntryId(req, res, tableName, entryId) {
        try {
            const filePath = this.fileManager.getTableFilePath(tableName);
            const tableData = await this.fileManager.readFile(filePath);

            const entry = tableData.find(item => item.entry_id === entryId);
            if (!entry) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Entry ID not found' }));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data: entry }));
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Table not found' }));
        }
    }

    async handleUpdateData(req, res, tableName, entryId) {
        try {
            const { data } = await this.parseBody(req);
            const filePath = this.fileManager.getTableFilePath(tableName);
            let tableData = await this.fileManager.readFile(filePath);

            const entryIndex = tableData.findIndex(item => item.entry_id === entryId);
            if (entryIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Entry ID not found' }));
            }

            const existingEntry = tableData[entryIndex];
            const keysToValidate = Object.keys(existingEntry).filter(key => key !== 'entry_id');
            const incomingDataKeys = Object.keys(data);

            for (const key of keysToValidate) {
                if (!incomingDataKeys.includes(key)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Missing field: ${key}` }));
                }
            }

            for (const key of incomingDataKeys) {
                if (!keysToValidate.includes(key)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: `Unexpected field: ${key}` }));
                }
            }

            delete data.entry_id;
            tableData[entryIndex] = { ...existingEntry, ...data, entry_id: entryId };

            await this.fileManager.writeFile(filePath, tableData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to update data' }));
        }
    }

    async handleDeleteDataByEntryId(req, res, tableName, entryId) {
        try {
            const filePath = this.fileManager.getTableFilePath(tableName);
            let tableData = await this.fileManager.readFile(filePath);

            const newTableData = tableData.filter(item => item.entry_id !== entryId);

            await this.fileManager.writeFile(filePath, newTableData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete data' }));
        }
    }

    async handleDeleteTable(req, res, tableName) {
        try {
            const filePath = this.fileManager.getTableFilePath(tableName);
            await this.fileManager.deleteFile(filePath);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Table not found' }));
        }
    }
}

export default RequestHandler;
