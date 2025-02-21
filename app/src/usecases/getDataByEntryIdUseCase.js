import UseCase from './useCase.js';

class GetDataByEntryIdUseCase extends UseCase {
    constructor(dataRepository) {
        super();
        this.dataRepository = dataRepository;
    }

    async execute(req, res,projectId, tableName, entryId) {
        try {
            const data = await this.dataRepository.getDataByEntryId(projectId,tableName, entryId);

            if (!data) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Entry ID not found' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ data }));
            }
        } catch (error) {
            console.error('Error in GetDataByEntryIdUseCase:', error);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Table not found', details: error.message }));
        }
    }
}

export default GetDataByEntryIdUseCase;
