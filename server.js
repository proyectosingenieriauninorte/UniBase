const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const getTableFilePath = (tableName) => path.join(process.env.HOME || __dirname, `${tableName}.json`);

const parseBody = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(body ? JSON.parse(body) : {});
    });
};

const handleStoreData = (req, res) => {
    parseBody(req, ({ table_name, data }) => {
        const filePath = getTableFilePath(table_name);

        fs.readFile(filePath, (err, fileData) => {
            let tableData = [];
            if (!err) {
                tableData = JSON.parse(fileData);
            }

            const index = tableData.length;
            tableData.push({ ...data, index });

            fs.writeFile(filePath, JSON.stringify(tableData), (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to store data' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ index }));
            });
        });
    });
};

const handleGetAllData = (req, res, tableName) => {
    const filePath = getTableFilePath(tableName);

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Table not found' }));
        }
        const tableData = JSON.parse(fileData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: tableData }));
    });
};

const handleGetDataByIndex = (req, res, tableName, index) => {
    const filePath = getTableFilePath(tableName);

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Table not found' }));
        }
        const tableData = JSON.parse(fileData);
        const entry = tableData.find(item => item.index === parseInt(index, 10));
        if (!entry) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Index not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: entry }));
    });
};

const handleUpdateData = (req, res, tableName, index) => {
    parseBody(req, ({ data }) => {
        const filePath = getTableFilePath(tableName);

        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Table not found' }));
            }
            let tableData = JSON.parse(fileData);
            const entryIndex = tableData.findIndex(item => item.index === parseInt(index, 10));
            if (entryIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Index not found' }));
            }
            tableData[entryIndex] = { ...data, index: parseInt(index, 10) };

            fs.writeFile(filePath, JSON.stringify(tableData), (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to update data' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'success' }));
            });
        });
    });
};

const handleDeleteDataByIndex = (req, res, tableName, index) => {
    const filePath = getTableFilePath(tableName);

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Table not found' }));
        }
        let tableData = JSON.parse(fileData);
        tableData = tableData.filter(item => item.index !== parseInt(index, 10));

        fs.writeFile(filePath, JSON.stringify(tableData), (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failed to delete data' }));
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        });
    });
};

const handleDeleteTable = (req, res, tableName) => {
    const filePath = getTableFilePath(tableName);

    fs.unlink(filePath, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Table not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'success' }));
    });
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
    const pathParts = pathname.split('/').filter(Boolean);

    if (req.method === 'POST' && pathParts[0] === 'data') {
        handleStoreData(req, res);
    } else if (req.method === 'GET' && pathParts.length === 2 && pathParts[0] === 'data') {
        handleGetAllData(req, res, pathParts[1]);
    } else if (req.method === 'GET' && pathParts.length === 3 && pathParts[0] === 'data') {
        handleGetDataByIndex(req, res, pathParts[1], pathParts[2]);
    } else if (req.method === 'PUT' && pathParts.length === 3 && pathParts[0] === 'data') {
        handleUpdateData(req, res, pathParts[1], pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts.length === 3 && pathParts[0] === 'data') {
        handleDeleteDataByIndex(req, res, pathParts[1], pathParts[2]);
    } else if (req.method === 'DELETE' && pathParts.length === 2 && pathParts[0] === 'data') {
        handleDeleteTable(req, res, pathParts[1]);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = server;