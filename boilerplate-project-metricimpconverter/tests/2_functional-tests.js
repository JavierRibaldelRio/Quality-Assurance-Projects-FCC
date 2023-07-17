const chaiHttp = require('chai-http');
const chai = require('chai');
let assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

    test('Test valid input for /api/converter', () => {

        chai.request(server).get('/api/convert?input=10L')
            .end((err, res) => {

                assert.equal(res.status, 200);
                assert.equal(res.body.initNum, 10);
                assert.equal(res.body.initUnit, "L");
                assert.equal(res.body.returnNum, 2.64172);
                assert.equal(res.body.returnUnit, 'gal');
                assert.equal(res.body.string, "10 liters converts to 2.64172 gallons");
            });
    });

    test('Test invalid input unit for /api/converter', () => {

        chai.request(server).get('/api/convert?input=32g')
            .end((err, res) => {

                assert.equal(res.text, 'invalid unit');
            })

    });

    test('Test invalid input number for /api/converter', () => {

        chai.request(server).get('/api/convert?input=3/7.2/4kg')
            .end((err, res) => {

                assert.equal(res.text, 'invalid number');
            })

    });

    test('Test invalid input number and unit for /api/converter', () => {


        chai.request(server).get('/api/convert?input=3/7.2/4kilosdf')
            .end((err, res) => {

                assert.equal(res.text, 'invalid number and unit');

            });
    });


    test('Test input without number for /api/converter', () => {

        chai.request(server).get('/api/convert?input=L')
            .end((err, res) => {

                assert.equal(res.status, 200);
                assert.equal(res.body.initNum, 1);
                assert.equal(res.body.initUnit, "L");
                assert.equal(res.body.returnNum, 0.26417);
                assert.equal(res.body.returnUnit, 'gal');
                assert.equal(res.body.string, "1 liters converts to 0.26417 gallons");
            });
    });



});
