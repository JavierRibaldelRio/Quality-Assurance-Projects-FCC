const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function () {

    test('#readingWholeInput, #notReadingWholeInput', () => {

        assert.equal(convertHandler.getNum("12km"), 12);
    });

    test("#readingDecimalInput, #notReadingDecimalInput", () => {

        assert.equal(convertHandler.getNum('12.2km'), 12.2);
    });

    test('#readingFractionalInput, #notReadingFractionalInput', () => {

        assert.equal(convertHandler.getNum('1/2km'), 0.5);
    })

    test('#readingDecimalFractionInput, #notReadingDecimalFractionInput', () => {

        assert.equal(convertHandler.getNum('2.2/2km'), 1.1);
    });

    test('#dealingWithMistakenDoubleFraction, #notDealingWithMistakenDoubleFraction', () => {

        assert.isNull(convertHandler.getNum('2/33/3km'));
    });

    test('#dealingWithNoNumericalInput, #notDealingWithNoNumericalInput', () => {

        assert.equal(convertHandler.getNum('km'), 1);
    });

    test('#readingInputs, #notReadingInputs', () => {

        assert.equal(convertHandler.getUnit('12km'), "km");
        assert.equal(convertHandler.getUnit('12kg'), "kg");
        assert.equal(convertHandler.getUnit('12mi'), "mi");
        assert.equal(convertHandler.getUnit('12gal'), "gal");
        assert.equal(convertHandler.getUnit('12lbs'), "lbs");
        assert.equal(convertHandler.getUnit('L'), "L");
    });

    test('#dealingWithMistakenInputs, #notDealingWithMistakenInputs', () => {

        assert.isNull(convertHandler.getUnit('12adsjf'));
    });

    test('#transformingUnits, #notTransformingUnits', () => {

        assert.equal(convertHandler.getReturnUnit('kg'), 'lbs');
        assert.equal(convertHandler.getReturnUnit('lbs'), 'kg');
        assert.equal(convertHandler.getReturnUnit('km'), 'mi');
        assert.equal(convertHandler.getReturnUnit('mi'), 'km');
        assert.equal(convertHandler.getReturnUnit('gal'), 'L');
        assert.equal(convertHandler.getReturnUnit('L'), 'gal');
    });

    test('#spellingOutUnits, #notSpellingOutUnits', () => {

        assert.equal(convertHandler.spellOutUnit('km'), 'kilometers');
        assert.equal(convertHandler.spellOutUnit('mi'), 'miles');
        assert.equal(convertHandler.spellOutUnit('kg'), 'kilograms');
        assert.equal(convertHandler.spellOutUnit('lbs'), 'pounds');
        assert.equal(convertHandler.spellOutUnit('gal'), 'gallons');
        assert.equal(convertHandler.spellOutUnit('L'), 'liters');

    });

    test('#transforminggalToL, #notTransforminggalToL', () =>

        assert.equal(convertHandler.convert(1, 'gal'), 3.78541)
    )

    test('#transformingLTogal, #notTransformingLToGal', () => {

        assert.equal(convertHandler.convert(3.78541, "L"), 1)
    })

    test('#transformingmiTokm, #notTransformingmiTokm', () =>

        assert.equal(convertHandler.convert(1, 'mi'), 1.60934)
    )

    test('#transformingkmTomi, #notTransformingkmTomil', () => {

        assert.equal(convertHandler.convert(1.60934, "km"), 1)
    })

    // Ojo al redondeo

    test('#transforminglbsTokg, #notTransforminglbsTokg', () =>

        assert.equal(convertHandler.convert(1, 'lbs'), 0.45359)
    )

    test('#transformingLToGal, #notTransformingLToGal', () => {

        assert.equal(convertHandler.convert(0.453592, "kg"), 1)
    })


});