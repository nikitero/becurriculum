// Archivo Character.js dentro de la carpeta models
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const userSchema = new Schema(
  {
    name:{ type: String, required: true },
    surname:{ type: String, required: true },
    passport:{ type: String, required: false, unique:true },
    dni:{ type: String, required: false },
    age:{ type: Number },
    nationality:{ type: String, required: true },
    phoneNumber:{ type: String, required: true },
    picture: { type: String }
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const User = mongoose.model('User', userSchema);
module.exports = User;