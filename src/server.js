import http from 'http';
import url from 'url';

class Server {
    constructor(port, requestHandler) {
        this.port = port || 3000;
        this.requestHandler = requestHandler;
        this.server = http.createServer((req, res) => this.handleRequest(req, res));
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const { pathname } = parsedUrl;
        const pathParts = pathname.split('/').filter(Boolean);

        if (req.method === 'POST' && pathParts[0] === 'data' && pathParts[1] === 'store') {
            this.requestHandler.handleStoreData(req, res);
        } else if (req.method === 'GET' && pathParts.length === 3 && pathParts[0] === 'data' && pathParts[2] === 'all') {
            this.requestHandler.handleGetAllData(req, res, pathParts[1]);
        } else if (req.method === 'GET' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'entry') {
            this.requestHandler.handleGetDataByEntryId(req, res, pathParts[1], pathParts[3]);
        } else if (req.method === 'PUT' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'update') {
            this.requestHandler.handleUpdateData(req, res, pathParts[1], pathParts[3]);
        } else if (req.method === 'DELETE' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'delete') {
            this.requestHandler.handleDeleteDataByEntryId(req, res, pathParts[1], pathParts[3]);
        } else if (req.method === 'DELETE' && pathParts.length === 3 && pathParts[0] === 'data' && pathParts[2] === 'delete') {
            this.requestHandler.handleDeleteTable(req, res, pathParts[1]);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

export default Server;
