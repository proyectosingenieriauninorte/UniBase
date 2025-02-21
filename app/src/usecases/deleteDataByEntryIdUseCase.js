import UseCase from './useCase.js';

class DeleteDataByEntryIdUseCase extends UseCase {
    constructor(dataRepository) {
        super();
        this.dataRepository = dataRepository;
    }

    async execute(req, res,projectId, tableName, entryId) {
        try {
            await this.dataRepository.deleteDataByEntryId(projectId,tableName, entryId);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            console.error('Error in DeleteDataByEntryIdUseCase:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to delete data', details: error.message }));
        }
    }
}

export default DeleteDataByEntryIdUseCase;
