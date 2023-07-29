'use strict';


const seleccionarProyecto = require('../models/issue.js');

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {

      // Selecciona la colección del proyecto
      const IssueForProject = seleccionarProyecto(req.params.project);

      // Almacena la query

      const query = req.query;

      // Busca la issue
      IssueForProject.find(query)
        .then((doc) => res.json(doc))
        .catch((e) => res.send('ERR: ' + e));

    })

    // Añadir un documento a la colección

    .post((req, res) => {

      // Selecciona la colección del proyecto
      const IssueForProject = seleccionarProyecto(req.params.project);

      // Crea una nueva issue al proyecto y la guarda
      const issue = new IssueForProject(req.body);

      issue.save()
        .then((doc) => {
          res.json(doc);
        })
        .catch((e) => {

          res.json({ error: 'required field(s) missing' })

        });
    })

    .put(function (req, res) {
      // Selecciona la colección del proyecto
      const IssueForProject = seleccionarProyecto(req.params.project);

      // Obyiene el id de la actual isseue
      const _id = req.body._id;

      // Crea la issue
      let issue = req.body;

      delete issue['_id'];
      if (_id === undefined) {
        res.json({ error: 'missing _id' });
      }

      else if (Object.keys(issue).length === 0) {

        res.json({ error: 'no update field(s) sent', '_id': _id });
      }
      else {

        issue.updated_on = new Date();

        IssueForProject.findByIdAndUpdate(_id, req.body)
          .then((doc) => {
            if (doc === null) {

              res.json({ error: 'could not update', '_id': _id });
            } else {

              res.json({ result: "successfully updated", _id });
            }
          })
          .catch((e) => res.json({ error: 'could not update', '_id': _id }));
      }

    })

    .delete(function (req, res) {
      // Selecciona la colección del proyecto
      const IssueForProject = seleccionarProyecto(req.params.project);

      // Obyiene el id de la actual isseue
      const _id = req.body._id;


      if (_id === undefined) {
        res.json({ error: 'missing _id' });
      }

      else if (Object.keys(req.body).length !== 1) {

        res.json({ error: 'could not delete', '_id': _id });
      }

      else {

        IssueForProject.deleteOne({ _id: _id })
          .then(() => res.json({ result: 'successfully deleted', '_id': _id }))
          .catch(() => res.json({ error: 'could not delete', '_id': _id }));
      }

    });

};
