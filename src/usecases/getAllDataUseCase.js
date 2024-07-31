import UseCase from './useCase.js';

class GetAllDataUseCase extends UseCase {
    constructor(dataRepository) {
        super();
        this.dataRepository = dataRepository;
    }

    async execute(req, res, tableName) {
        try {
            const data = await this.dataRepository.getAllData(tableName);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ data }));
        } catch (error) {
            console.error('Error in GetAllDataUseCase:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to retrieve data', details: error.message }));
        }
    }
}

export default GetAllDataUseCase;
