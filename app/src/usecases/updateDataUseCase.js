import UseCase from './useCase.js';

class UpdateDataUseCase extends UseCase {
    constructor(dataRepository) {
        super();
        this.dataRepository = dataRepository;
    }

    async execute(req, res, projectId, tableName, entryId) {
        try {
            const { data } = await this.parseBody(req);
            const updatedData = await this.dataRepository.updateData(projectId,tableName, entryId, data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success', data: updatedData }));
        } catch (error) {
            console.error('Error in UpdateDataUseCase:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to update data', details: error.message }));
        }
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
}

export default UpdateDataUseCase;
