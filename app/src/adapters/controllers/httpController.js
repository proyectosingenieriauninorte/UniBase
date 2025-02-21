class HttpController {
    constructor(useCases) {
        this.useCases = useCases;
    }

    async handleRequest(req, res) {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const { pathname } = parsedUrl;
        const pathParts = pathname.split('/').filter(Boolean);
    
        if (pathParts.length < 2) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Project ID is required' }));
            return;
        }
    
        const projectId = pathParts[0];
    
        if (req.method === 'POST' && pathParts[1] === 'data' && pathParts[2] === 'store') {
            await this.useCases.storeData.execute(req, res, projectId);
        } else if (req.method === 'GET' && pathParts.length === 4 && pathParts[1] === 'data' && pathParts[3] === 'all') {
            await this.useCases.getAllData.execute(req, res, projectId, pathParts[2]);
        } else if (req.method === 'GET' && pathParts.length === 5 && pathParts[1] === 'data' && pathParts[3] === 'entry') {
            await this.useCases.getDataByEntryId.execute(req, res, projectId, pathParts[2], pathParts[4]);
        } else if (req.method === 'PUT' && pathParts.length === 5 && pathParts[1] === 'data' && pathParts[3] === 'update') {
            await this.useCases.updateData.execute(req, res, projectId, pathParts[2], pathParts[4]);
        } else if (req.method === 'DELETE' && pathParts.length === 5 && pathParts[1] === 'data' && pathParts[3] === 'delete') {
            await this.useCases.deleteDataByEntryId.execute(req, res, projectId, pathParts[2], pathParts[4]);
        } else if (req.method === 'DELETE' && pathParts.length === 4 && pathParts[1] === 'data' && pathParts[3] === 'delete') {
            await this.useCases.deleteTable.execute(req, res, projectId, pathParts[2]);
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    }
}

export default HttpController;
