/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Libros = require('../models/Libro');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Libros.find({})
        .then(doc => {

          res.json(doc.map(l => ({ _id: l._id, title: l.title, commentcount: l.title.length })))

        })


    })

    // Añade un libro a la base de datos
    .post(function (req, res) {
      let title = req.body.title;

      if (title === undefined) {
        res.send('missing required field title')
      }
      else {
        new Libros({ title: title })
          .save()
          .then(doc => res.json({ _id: doc._id, title }))
          .catch(e => {

            console.error(e);

            res.status(400).send(e)
          });
      }


    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'

      Libros.deleteMany({})
        .then(() => res.send('complete delete successful'));

    });



  app.route('/api/books/:id')
    .get((req, res) => {
      const bookid = req.params.id;

      Libros.findById(bookid)
        .then(doc => {
          if (doc !== null) {
            res.json(doc)
          }

          else {
            res.send('no book exists');
          }
        })

        .catch(e => res.send('no book exists'));

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (comment === undefined) {

        res.send('missing required field comment');
      }
      else {

        Libros.findById(bookid)
          .then(doc => {

            doc.comments.push(comment);

            doc.save()
              .then(doc => res.json(doc))


          })
          .catch(e => res.send('no book exists'));
      }



      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Libros.findById(bookid)
        .then((doc) => {

          if (doc !== null) {

            res.send('delete successful');
          }
          else {

            res.send('no book exists');
          }
        })
        .catch(e => res.send('no book exists'))


    });

};
