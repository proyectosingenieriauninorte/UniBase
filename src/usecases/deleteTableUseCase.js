import UseCase from './useCase.js';

class DeleteTableUseCase extends UseCase {
    constructor(dataRepository) {
        super();
        this.dataRepository = dataRepository;
    }

    async execute(req, res, tableName) {
        try {
            await this.dataRepository.deleteTable(tableName);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        } catch (error) {
            console.error('Error in DeleteTableUseCase:', error);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Table not found', details: error.message }));
        }
    }
}

export default DeleteTableUseCase;
