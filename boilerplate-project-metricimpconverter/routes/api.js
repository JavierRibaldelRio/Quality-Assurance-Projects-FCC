'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {

  let convertHandler = new ConvertHandler();


  app.get('/api/convert', (req, res) => {

    const input = req.query.input;

    // unidad inicial
    const initUnit = convertHandler.getUnit(input);
    const returnUnit = convertHandler.getReturnUnit(initUnit);



    // Tranformación
    const initNum = convertHandler.getNum(input)
    const returnNum = convertHandler.convert(initNum, initUnit)

    if (initUnit === null && initNum !== null) {
      res.send('invalid unit')
    }
    else if (initUnit !== null && initNum === null) {
      res.send('invalid number')
    }
    else if (initUnit === null && initNum === null) {

      res.send('invalid number and unit')
    }

    else {

      res.json({ initNum, initUnit, returnNum, returnUnit, string: convertHandler.getString(initNum, initUnit, returnNum, returnUnit) });

    }
  });

};
