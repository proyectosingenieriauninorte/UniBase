
class RequestHandler {
    constructor(dataManager) {
        this.dataManager = dataManager;
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
            const entry_id = await this.dataManager.storeData(table_name, data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ entry_id }));
        } catch (error) {
            console.error('Error in handleStoreData:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to store data', details: error.message }));
        }
    }

    async handleGetAllData(req, res, tableName) {
        try {
            const data = await this.dataManager.getAllData(tableName);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data }));
        } catch (error) {
            console.error('Error in handleGetAllData:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve data', details: error.message }));
        }
    }

    async handleGetDataByEntryId(req, res, tableName, entryId) {
        try {
            const data = await this.dataManager.getDataByEntryId(tableName, entryId);

            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Entry ID not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ data }));
            }
        } catch (error) {
            console.error('Error in handleGetDataByEntryId:', error);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Table not found', details: error.message }));
        }
    }

    async handleUpdateData(req, res, tableName, entryId) {
        try {
            const { data } = await this.parseBody(req);
            const updatedData = await this.dataManager.updateData(tableName, entryId, data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success', data: updatedData }));
        } catch (error) {
            console.error('Error in handleUpdateData:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to update data', details: error.message }));
        }
    }

    async handleDeleteDataByEntryId(req, res, tableName, entryId) {
        try {
            await this.dataManager.deleteDataByEntryId(tableName, entryId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            console.error('Error in handleDeleteDataByEntryId:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete data', details: error.message }));
        }
    }

    async handleDeleteTable(req, res, tableName) {
        try {
            await this.dataManager.deleteTable(tableName);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            console.error('Error in handleDeleteTable:', error);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Table not found', details: error.message }));
        }
    }
}

export default RequestHandler;
