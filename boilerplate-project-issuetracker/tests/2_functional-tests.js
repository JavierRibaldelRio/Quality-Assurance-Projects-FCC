const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');


const seleccionarProyecto = require('../models/issue.js');

chai.use(chaiHttp);

suite('Functional Tests', function () {


    // Datos a buscar en los fuuros tests
    const autorABuscar = "Juan Antonio";
    const tituloABuscar = "TestII";


    async function llenarColeccion(col) {

        new col({
            issue_title: tituloABuscar,
            issue_text: "Text test II",
            created_by: autorABuscar
        }).save();

        new col({

            issue_title: "Test II (hello)",
            issue_text: "lorem ipsum",
            created_by: "Cantabria"
        }).save();


        return await new col({
            issue_title: 'Como estas',
            issue_text: "Text test II",
            created_by: autorABuscar
        }).save();
    }

    const projectTest = "Test-Project-" + Math.floor(Math.random() * 10000);

    const generarRuta = (coleccion) => '/api/issues/' + coleccion;

    suite("POST Tests", () => {

        const ruta = generarRuta(projectTest + "-POST");

        test('POST an issue with every field', (done) => {

            chai.request(server)
                .post(ruta)
                .send({
                    issue_title: 'Test I',
                    issue_text: 'Issue text test',
                    created_by: 'Created test',
                    assigned_to: 'Assigned test',
                    status_text: 'Status test',
                    open: true
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);

                    assert.equal(res.body.issue_title, "Test I");
                    assert.equal(res.body.issue_text, 'Issue text test');
                    assert.equal(res.body.created_by, "Created test");
                    assert.equal(res.body.assigned_to, "Assigned test")
                    assert.equal(res.body.status_text, 'Status test');
                    assert.equal(res.body.open, true);

                    assert.deepEqual(res.body.updated_on, res.body.created_on);

                    done();
                });
        });

        test('POST an issue with only requiered fields', (done) => {

            chai.request(server)
                .post(ruta)
                .send({
                    issue_title: "Title Test II",
                    issue_text: "Text Test II",
                    created_by: 'Created Test II'
                })
                .end((err, res) => {

                    assert.equal(res.status, 200);

                    assert.equal(res.body.issue_title, 'Title Test II');
                    assert.equal(res.body.issue_text, 'Text Test II');
                    assert.equal(res.body.created_by, 'Created Test II');
                    assert.equal(res.body.status_text, '');
                    assert.equal(res.body.assigned_to, '');
                    assert.equal(res.body.open, true);

                    assert.deepEqual(res.body.updated_on, res.body.created_on);

                    done();
                })

        });


        test('POST an issue with missing required field', (done) => {

            chai.request(server)
                .post(ruta)
                .send({
                    issue_text: "hola",
                    issue_created_by: "Jr"
                })
                .end((err, res) => {

                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                })
        });
    });

    suite("GET Tests", () => {

        // Ruta donde se realiza los tests
        const ruta = generarRuta(projectTest + "-GET");

        // Coleccion sobre la que se va a trabajar
        const coleccion = seleccionarProyecto(projectTest + "-GET");

        llenarColeccion(coleccion);


        test('GET all issues of a project', (done) => {


            chai.request(server)
                .get(ruta)
                .end((err, res) => {


                    assert.equal(res.status, 200);

                    assert.isArray(res.body);

                    assert.equal(res.body.length, 3);

                    done();

                })
        });

        test('GET issues of a project with one filter', (done) => {


            chai.request(server)
                .get(ruta + '?created_by=' + autorABuscar)
                .end((err, res) => {


                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body.length, 2);

                    done();
                });

        });


        test('GET issues of a projec with multiple filters', (done) => {

            chai.request(server)
                .get(ruta + '?created_by=' + autorABuscar + "&issue_title=" + tituloABuscar)
                .end((err, res) => {

                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body.length, 1);
                    done();
                })

        });
    });


    suite('PUT Tests', () => {

        // Ruta donde se realiza los tests
        const ruta = generarRuta(projectTest + "-PUT");

        // Coleccion sobre la que se va a trabajar
        const coleccion = seleccionarProyecto(projectTest + "-PUT");


        test("PUT one field on an issue", (done) => {

            new coleccion({ issue_title: "Change Me", issue_text: "Test Put I", created_by: "Chai" })
                .save()
                .then(doc => {

                    chai.request(server)
                        .put(ruta)
                        .send({

                            _id: doc._id,
                            issue_title: "He sido cambiado"
                        })
                        .end((err, res) => {

                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully updated');
                            assert.equal(res.body._id, doc._id);

                            done();

                        });
                });
        });


        test("PUT multiple fields on an issue", (done) => {

            new coleccion({
                issue_title: "Change me",
                issue_text: "Change me",
                created_by: "Chai"
            })
                .save()
                .then(doc => {

                    chai.request(server)
                        .put(ruta)
                        .send({

                            _id: doc._id,
                            issue_title: "Change color",
                            issue_text: "There is a color"
                        })
                        .end((err, res) => {

                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully updated');
                            assert.equal(res.body._id, doc._id);

                            done();
                        })

                })
        })

        test("PUT request without ID", (done) => {

            chai.request(server)
                .put(ruta)
                .send({

                    issue_title: "Nunca seré un título :_("
                })
                .end((err, res) => {

                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });

        test('PUT request without fields to change', (done) => {

            // Id falso para que salte el error
            const id = "HOLASOYUNID";


            chai.request(server)
                .put(ruta)
                .send({

                    _id: id
                })
                .end((err, res) => {

                    assert.equal(res.body.error, 'no update field(s) sent');
                    assert.equal(res.body._id, id);
                    done();
                });
        });

        test("PUT mistaken request", (done) => {

            // Un id para
            const id = "Nosoyunid";

            chai.request(server)
                .put(ruta)
                .send({

                    _id: id,
                    issue_title: "Hola mundo"
                })
                .end((err, res) => {

                    assert.equal(res.body.error, 'could not update')
                    assert.equal(res.body._id, id);
                    done();
                })
        })

    });


    suite('DELETE Tests', () => {

        // Ruta donde se realiza los tests
        const ruta = generarRuta(projectTest + "-DELETE");

        // Coleccion sobre la que se va a trabajar
        const coleccion = seleccionarProyecto(projectTest + "-DELETE");

        test("DELETE an issue ", (done) => {

            // Añade una nueva colección a la base de datos

            new coleccion({
                issue_title: "Voy a ser eliminada",
                issue_text: "Pero si no he hecho nada malo",
                created_by: "Chai"
            })
                .save()
                .then(doc => {

                    // Manda la petición de eliminar
                    chai.request(server)
                        .delete(ruta)
                        .send({

                            _id: doc._id
                        })
                        .end((err, res) => {

                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully deleted');
                            assert.equal(res.body._id, doc._id);

                            done();
                        })

                })

        });

        test("DELETE an issue with invalid ID", (done) => {

            // Almacena un id erroneo

            const id = "asdjfhasdjklfh";

            chai.request(server)
                .delete(ruta)
                .send({
                    _id: id
                })
                .end((err, res) => {

                    assert.equal(res.body.error, "could not delete");
                    assert.equal(res.body._id, id);
                    done();
                })
        });

        test("DELETE an issue with missing ID", (done) => {

            chai.request(server)
                .delete(ruta)
                .end((err, res) => {

                    assert.equal(res.body.error, 'missing _id');
                    done();
                })
        })

    })


});


