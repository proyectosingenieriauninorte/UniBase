class HttpController {
    constructor(useCases) {
        this.useCases = useCases;
    }

    async handleRequest(req, res) {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const { pathname } = parsedUrl;
        const pathParts = pathname.split('/').filter(Boolean);

        if (req.method === 'POST' && pathParts[0] === 'data' && pathParts[1] === 'store') {
            await this.useCases.storeData.execute(req, res);
        } else if (req.method === 'GET' && pathParts.length === 3 && pathParts[0] === 'data' && pathParts[2] === 'all') {
            await this.useCases.getAllData.execute(req, res, pathParts[1]);
        } else if (req.method === 'GET' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'entry') {
            await this.useCases.getDataByEntryId.execute(req, res, pathParts[1], pathParts[3]);
        } else if (req.method === 'PUT' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'update') {
            await this.useCases.updateData.execute(req, res, pathParts[1], pathParts[3]);
        } else if (req.method === 'DELETE' && pathParts.length === 4 && pathParts[0] === 'data' && pathParts[2] === 'delete') {
            await this.useCases.deleteDataByEntryId.execute(req, res, pathParts[1], pathParts[3]);
        } else if (req.method === 'DELETE' && pathParts.length === 3 && pathParts[0] === 'data' && pathParts[2] === 'delete') {
            await this.useCases.deleteTable.execute(req, res, pathParts[1]);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    }
}

export default HttpController;
