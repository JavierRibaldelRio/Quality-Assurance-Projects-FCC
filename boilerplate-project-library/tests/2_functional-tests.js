/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Libros = require('../models/Libro');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function (done) {
    chai.request(server)
      .get('/api/books')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {

    const ruta = '/api/books/'


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {

        chai.request(server)
          .post(ruta)
          .send({ title: "La historia interminable" })
          .end((err, res) => {


            assert.equal(res.status, 200);

            assert.property(res.body, 'title');
            assert.property(res.body, '_id');

            done();

          })

      });

      test('Test POST /api/books with no title given', function (done) {

        chai.request(server)
          .post(ruta)
          .send({})
          .end((err, res) => {

            assert.equal(res.text, 'missing required field title');
            done();
          })

      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {

        chai.request(server)
          .get(ruta)
          .end((err, res) => {

            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "title");
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount');

            done();

          })

      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {

        chai.request(server)
          .get(ruta + 'asdjfhalksjdfh')
          .end((err, res) => {

            assert.equal(res.text, 'no book exists');
            done();
          })

        //done();
      });

      test('Test GET /api/books/[id] with valid id in db', (done) => {

        new Libros({ title: 'test' })
          .save()
          .then(doc => {

            chai.request(server)
              .get(ruta + doc._id)
              .end((err, res) => {

                assert.equal(res.status, 200);

                assert.property(res.body, 'title');
                assert.property(res.body, '_id');
                assert.property(res.body, 'comments');

                done();

              });
          });
        //done();
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        new Libros({ title: 'test' })
          .save()
          .then(doc => {

            chai.request(server)
              .post(ruta + doc._id)
              .send({
                comment: 'test'
              })
              .end((err, res) => {

                assert.equal(res.status, 200);

                assert.property(res.body, 'title');
                assert.property(res.body, '_id');
                assert.property(res.body, 'comments');

                done();

              });
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {

        chai.request(server)
          .post(ruta + 'asdf')
          .end((err, res) => {

            assert.equal(res.text, 'missing required field comment');

            done();
          })

        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {


        chai.request(server)
          .post(ruta + '2134')
          .send({

            comment: 'asdf'
          })
          .end((err, res) => {


            assert.equal(res.text, 'no book exists');
            done();
          })
        //done();
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {


        new Libros({ title: 'test' })
          .save()
          .then(doc => {

            chai.request(server)
              .delete(ruta + doc._id)
              .end((err, res) => {

                assert.equal(res.status, 200);

                assert.equal(res.text, 'delete successful')

                done();

              });
          });

        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {

        chai.request(server)
          .delete(ruta + "asdhf")
          .end((err, res) => {

            assert.equal(res.text, 'no book exists');
            done();
          })
        //done();
      });

    });

  });

});
