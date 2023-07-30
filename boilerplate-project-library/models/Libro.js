// Obtiene las variables de entorno
require('dotenv').config();

const mongoose = require('mongoose');

// Define el esquema
const libroSchema = new mongoose.Schema({

    title: { type: String, required: true },

    comments: { type: Array, required: true, default: [] }

}, { versionKey: false })

// Se conecta a la base del libro
mongoose.connect(process.env.DB);


module.exports = mongoose.model('libros', libroSchema);