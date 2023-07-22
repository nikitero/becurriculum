// Archivo character.seed.js

const mongoose = require('mongoose');

// Imporatmos el modelo Pet en este nuevo archivo.
const User = require('../models/User');
const { DB_URL } = require('../db')

const userList = [
  {
    name: 'Nikita',
    surname:'Vasiljevs',
    passport:'',
    dni:'Y0781514B',
    age: 32,
    nationality: 'Letonia',
    phoneNumber:'622529583',
    picture:''
  }
];

const userDocuments = userList.map(user => new User(user));

// En este caso, nos conectaremos de nuevo a nuestra base de datos
// pero nos desconectaremos tras insertar los documentos
mongoose
  .connect( DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
		// Utilizando Character.find() obtendremos un array con todos los personajes de la db
    const allUsers = await User.find();
		
		// Si existen personajes previamente, dropearemos la colección
    if (allUsers.length) {
      await User.collection.drop(); //La función drop borra la colección
    }
  })
  .catch((err) => console.log(`Error deleting data: ${err}`))
  .then(async () => {
		// Una vez vaciada la db de los personajes, usaremos el array characterDocuments
		// para llenar nuestra base de datos con todas los personajes.
		await User.insertMany(userDocuments);
	})
  .catch((err) => console.log(`Error creating data: ${err}`))
	// Por último nos desconectaremos de la DB.
  .finally(() => mongoose.disconnect());