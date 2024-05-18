const mongoose = require('mongoose');
require('dotenv').config();


// URL local de nuestra base de datos en mongoose y su nombre upgrade_class_3
const DB_URL = process.env.DB_URL || 'mongodb://0.0.0.0:27017/curriculum';

// Función que conecta nuestro servidor a la base de datos de MongoDB mediante mongoose
const connect = () => mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  DB_URL,
  connect
};


