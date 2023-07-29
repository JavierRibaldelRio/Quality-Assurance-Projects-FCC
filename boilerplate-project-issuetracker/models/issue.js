// Conexión con la base de datos de Mongo

require('dotenv').config();

const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;


mongoose.set('strictQuery', true);

// Modelo de la issue

let issueEsquema = new mongoose.Schema({

    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: '' },
    status_text: { type: String, default: '' },

    created_on: { type: Date, default: new Date() },
    updated_on: { type: Date, default: new Date() },

    open: { type: Boolean, required: true, default: true }


}, { versionKey: false });


mongoose.connect(URI);

// Crea un esquema para la colección en función del proyecto

function crearEsquema(proyecto) {

    return mongoose.model(proyecto, issueEsquema);
}

module.exports = crearEsquema;
