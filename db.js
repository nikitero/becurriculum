const mongoose = require('mongoose');

// URL local de nuestra base de datos en mongoose y su nombre upgrade_class_3
const DB_URL = 'mongodb://0.0.0.0:27017/curriculum';

// Función que conecta nuestro servidor a la base de datos de MongoDB mediante mongoose
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
