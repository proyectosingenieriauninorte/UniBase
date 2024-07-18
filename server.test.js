const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // assuming your server file is named server.js
const should = chai.should();

chai.use(chaiHttp);

describe('UniBase API', () => {
    describe('/POST data', () => {
        it('it should store data and return the index', (done) => {
            chai.request(server)
                .post('/data')
                .send({
                    table_name: 'test_table',
                    data: { name: 'John Doe', age: 30 }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('index').eql(0);
                    done();
                });
        });
    });

    describe('/GET data/:table_name', () => {
        it('it should GET all the data for a table', (done) => {
            chai.request(server)
                .get('/data/test_table')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.be.a('array');
                    res.body.data.length.should.be.eql(1);
                    done();
                });
        });
    });

    describe('/GET data/:table_name/:index', () => {
        it('it should GET a data entry by the given index', (done) => {
            chai.request(server)
                .get('/data/test_table/0')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('age');
                    res.body.data.should.have.property('index').eql(0);
                    done();
                });
        });
    });

    describe('/PUT data/:table_name/:index', () => {
        it('it should UPDATE a data entry by the given index', (done) => {
            chai.request(server)
                .put('/data/test_table/0')
                .send({ data: { name: 'Jane Doe', age: 25 } })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
    });

    describe('/DELETE data/:table_name/:index', () => {
        it('it should DELETE a data entry by the given index', (done) => {
            chai.request(server)
                .delete('/data/test_table/0')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
    });

    describe('/DELETE data/:table_name', () => {
        it('it should DELETE the table', (done) => {
            chai.request(server)
                .delete('/data/test_table')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    done();
                });
        });
    });
});
