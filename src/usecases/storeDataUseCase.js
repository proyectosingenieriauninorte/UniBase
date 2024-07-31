import UseCase from './useCase.js';

class StoreDataUseCase extends UseCase {
    constructor(dataRepository) {
        super();
        this.dataRepository = dataRepository;
    }

    async execute(req, res) {
        try {
            const { table_name, data } = await this.parseBody(req);
            const entry_id = await this.dataRepository.storeData(table_name, data);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ entry_id }));
        } catch (error) {
            console.error('Error in StoreDataUseCase:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to store data', details: error.message }));
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

export default StoreDataUseCase;
