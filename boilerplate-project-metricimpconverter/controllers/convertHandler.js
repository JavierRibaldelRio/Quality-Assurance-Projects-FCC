// Modulo que se dedica a tratar con las unidades
function ConvertHandler(input) {


  this.getNum = function (input) {

    // Almacena el número en formato strong

    let stringNumero = '';

    const arrInput = input.split('');

    // Elimina la unidad
    for (let i = 0; i < arrInput.length && !esLetra(arrInput[i]); i++) {
      stringNumero += arrInput[i];
    }

    // Si no hay ningún numero entonces es uno

    if (stringNumero === '') {

      return 1;
    }

    // Almacena el número
    let num;

    // Almacena el numero partido por las fracciones

    const numeroPartidoFracciones = stringNumero.split('/')

    // La regex expresión equivale a buscar la barra
    if (numeroPartidoFracciones.length === 2) {

      num = Number(numeroPartidoFracciones[0]) / Number(numeroPartidoFracciones[1]);

    }

    else if (numeroPartidoFracciones.length === 1) {

      num = Number(numeroPartidoFracciones[0]);
    }

    else {

      return null;
    }

    return Number(num);

  };

  // Obtiene las unidades del input, Si no hay nada devuelve un input vacio
  this.getUnit = function (input) {

    const unidades = ["l", 'gal', 'km', 'mi', 'kg', 'lbs']

    let unit = input.toLowerCase().split('').filter(esLetra).join('');

    if (unidades.includes(unit)) {
      if (unit === "l") {

        unit = unit.toUpperCase();
      }

      return unit;
    }


    // Si la unidad está mala devuelv enulo

    return null;

  };

  // Devuelve la equivalencia
  this.getReturnUnit = function (initUnit) {
    return equivalencias[initUnit];
  };

  this.spellOutUnit = function (unit) {

    const equivalenciasTexto = {

      km: "kilometers",
      mi: "miles",
      gal: "gallons",
      L: "liters",
      lbs: "pounds",
      kg: "kilograms"

    }

    return equivalenciasTexto[unit];
  };

  this.convert = function (initNum, initUnit) {

    // Valor por el que hay que multiplicar para obtener la conversión
    const factor = {
      gal: 3.78541,
      lbs: 0.453592,
      mi: 1.60934,
      L: 1 / 3.78541,
      kg: 1 / 0.453592,
      km: 1 / 1.60934
    }
    return Number((initNum * factor[initUnit]).toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {

    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };

}


// Almacena las equivalencias de las unidades

const equivalencias = {

  gal: "L",
  lbs: "kg",
  mi: "km",
  L: "gal",
  kg: "lbs",
  km: "mi",
}



// Función que comprueba si un carracter es una letra

function esLetra(char) {

  return char.toUpperCase() !== char.toLowerCase();
}

module.exports = ConvertHandler;
