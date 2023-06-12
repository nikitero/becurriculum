const express = require("express");

const User = require('../models/User');

const router = express.Router();

//GET
//All Users http://localhost:3000/users
router.get('/', (req,res) => {
    return User.find()
    .then(users => {
        // Si encontramos los personajes, los devolveremos al usuario
        console.log(users);
        return res.status(200).json(users);
    })
    .catch(err => {
        // Si hay un error, enviaremos por ahora una respuesta de error.
        return res.status(500).json(err);
    });
});


//User by ID: http://localhost:3000/users/:id
router.get('/:id', (req,res) => {
    const { id } = req.params;
    return User.findById(id)
    .then(user => {
    if (user){
        console.log(user);
        return res.status(200).json(user);
    } else {
        return res.status(404).json('No character found by the provided id')
    }
    })
    .catch(err => {
        // Si hay un error, enviaremos por ahora una respuesta de error.
        return res.status(500).json(err);
    });
});


//Users by DNI http://localhost:3000/users/dni/Y0781514B
router.get('/dni/:dni', (req,res) => {
    const { dni } = req.params;
    return User.findOne({dni: dni})
    .then(user => {
    if (user){
        console.log(user);
        return res.status(200).json(user);
    } else {
        return res.status(404).json('No character found by the provided dni')
    }
    })
    .catch(err => {
        // Si hay un error, enviaremos por ahora una respuesta de error.
        return res.status(500).json(err);
    });
});


//CREATE 
//Create a user http://localhost:3000/users/create
router.post('/create', async (req, res, next) => {
    try {
      // Crearemos una instancia de character con los datos enviados
    const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            passport: req.body.passport,
            dni: req.body.dni,
            age: req.body.age,
            nationality: req.body.nationality,
            phoneNumber: req.body.phoneNumber,
            education:{ 
                secondary: {
                    title: req.body.title,
                    years: req.body.years,
                    place: req.body.place,
                },
                university:{
                    title: req.body.title,
                    years: req.body.years,
                    place: req.body.place,
                },
                additional:{
                    title: req.body.title,
                    years: req.body.years,
                    place: req.body.place,
                },
            },
            jobExperience: req.body.jobExperience
    });

      // Guardamos el personaje en la DB
    const createdUser = await newUser.save();
    return res.status(201).json(createdUser);
    } catch (error) {
        if (error.code === 11000) {
            // Código 11000 indica duplicado en índice único
            console.error('Ya existe un usuario con ese pasaporte, DNI o número de teléfono.');
            return res.status(404).json('Ya existe un usuario con ese pasaporte, DNI o número de teléfono');
        } else {
            // Otro error
        next(error);
        }
    }
});


//PUT http://localhost:3000/users/6483465ba53ee57033b1875d
router.put('/edit/:id', async (req, res, next) => {
    try {
        const { id } = req.params //Recuperamos el id de la url
        const userModify = new User(req.body) //instanciamos un nuevo User con la información del body
        userModify._id = id //añadimos la propiedad _id al personaje creado
        const characterUpdated = await User.findByIdAndUpdate(id , userModify)
        return res.status(200).json(characterUpdated)//Este personaje que devolvemos es el anterior a su modificación
    } catch (error) {
        return next(error)
    }
});


//DELETE http://localhost:3000/users/6483465ba53ee57033b1875d
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json('User deleted!');
    } catch (error) {
        return next(error);
    }
});




module.exports = router;


