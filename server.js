import http from 'http';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const getTableFilePath = (tableName) => path.join(DATA_DIR, `${tableName}.json`);

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

            const entry_id = Date.now().toString(); // Unique entry ID based on timestamp
            tableData.push({ ...data, entry_id });

            fs.writeFile(filePath, JSON.stringify(tableData), (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Failed to store data' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ entry_id }));
            });
        });
    });
};

const handleGetAllData = (req, res, tableName) => {
    const filePath = getTableFilePath(tableName);

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ data: [] }));
        }
        const tableData = JSON.parse(fileData);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: tableData }));
    });
};

const handleGetDataByEntryId = (req, res, tableName, entryId) => {
    const filePath = getTableFilePath(tableName);

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Table not found' }));
        }
        const tableData = JSON.parse(fileData);
        const entry = tableData.find(item => item.entry_id === entryId);
        if (!entry) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Entry ID not found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ data: entry }));
    });
};

const handleUpdateData = (req, res, tableName, entryId) => {
    parseBody(req, ({ data }) => {
        const filePath = getTableFilePath(tableName);

        fs.readFile(filePath, (err, fileData) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Table not found' }));
            }
            let tableData = JSON.parse(fileData);
            const entryIndex = tableData.findIndex(item => item.entry_id === entryId);
            if (entryIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Entry ID not found' }));
            }
            tableData[entryIndex] = { ...data, entry_id: entryId };

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

const handleDeleteDataByEntryId = (req, res, tableName, entryId) => {
    const filePath = getTableFilePath(tableName);

    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Table not found' }));
        }
        let tableData = JSON.parse(fileData);
        const newTableData = tableData.filter(item => item.entry_id !== entryId);

        fs.writeFile(filePath, JSON.stringify(newTableData), (err) => {
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
    const { pathname } = parsedUrl;
    const pathParts = pathname.split('/').filter(Boolean);

    if (req.method === 'POST' && pathParts[0] === 'data' && pathParts[1] === 'store') {
        handleStoreData(req, res);
    } else if (req.method === 'GET' && pathParts.length === 3 && pathParts[0] === 'data' && pathParts[2] === 'all') {
        handleGetAllData(req, res, pathParts[1]);
    } else if (req.method === 'GET' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'entry') {
        handleGetDataByEntryId(req, res, pathParts[1], pathParts[3]);
    } else if (req.method === 'PUT' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'update') {
        handleUpdateData(req, res, pathParts[1], pathParts[3]);
    } else if (req.method === 'DELETE' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'delete') {
        handleDeleteDataByEntryId(req, res, pathParts[1], pathParts[3]);
    } else if (req.method === 'DELETE' && pathParts.length === 3 && pathParts[0] === 'data' && pathParts[2] === 'delete') {
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

export default server;
