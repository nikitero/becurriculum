const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Creamos el esquema de personajes
const userSchema = new Schema(
  {
    email:{ type: String, required: true },
    password:{ type: String, required: true },
  },
  {
    // Esta propiedad servirá para guardar las fechas de creación y actualización de los documentos
    timestamps: true,
  }
);

// Creamos y exportamos el modelo Character
const LoggedUser = mongoose.model('LoggedUser', userSchema);
module.exports = LoggedUser;