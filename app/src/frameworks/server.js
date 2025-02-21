import http from 'http';

class Server {
    constructor(port, httpController) {
        this.port = port || 3000;
        this.httpController = httpController;
        this.server = http.createServer((req, res) => this.httpController.handleRequest(req, res));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

export default Server;
