class IRequestHandler {
    parseBody(req) {
        throw new Error("Method 'parseBody()' must be implemented.");
    }

    handleStoreData(req, res) {
        throw new Error("Method 'handleStoreData()' must be implemented.");
    }

    handleGetAllData(req, res, tableName) {
        throw new Error("Method 'handleGetAllData()' must be implemented.");
    }

    handleGetDataByEntryId(req, res, tableName, entryId) {
        throw new Error("Method 'handleGetDataByEntryId()' must be implemented.");
    }

    handleUpdateData(req, res, tableName, entryId) {
        throw new Error("Method 'handleUpdateData()' must be implemented.");
    }

    handleDeleteDataByEntryId(req, res, tableName, entryId) {
        throw new Error("Method 'handleDeleteDataByEntryId()' must be implemented.");
    }

    handleDeleteTable(req, res, tableName) {
        throw new Error("Method 'handleDeleteTable()' must be implemented.");
    }
}

export default IRequestHandler;
