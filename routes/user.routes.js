const express = require('express');
const User = require('../models/User');
const fileMiddleware = require('../middlewares/file.middleware');
const { isAuth } =  require("../auth/jwt");


const router = express.Router();


//GET
//All Users http://localhost:3000/users
router.get('/',  (req,res) => {
    return User.find()
    .then(users => {
        //Returning the list of the users
        console.log(users);
        return res.status(200).json(users);
    })
    .catch(err => {
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
        return res.status(500).json(err);
    });
});


//CREATE 
//Create a user http://localhost:3000/users/create
router.post('/create', [isAuth], [fileMiddleware.upload.single('picture'), fileMiddleware.uploadToCloudinary], async (req, res, next) => {
    try {
    const userPicture = req.file_url ? req.file_url : null;

    const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            passport: req.body.passport,
            dni: req.body.dni,
            age: req.body.age,
            nationality: req.body.nationality,
            phoneNumber: req.body.phoneNumber,
            picture: userPicture
    });

    //Saving user in the Data Base
    const createdUser = await newUser.save();
    return res.status(201).json(createdUser);
    } catch (error) {
        if (error.code === 11000) {
            // Code 11000 shows the error in the unique fields
            console.error('Ya existe un usuario con ese pasaporte');
            return res.status(404).json('Ya existe un usuario con ese pasaporte');
        } else {

        next(error);
        }
    }
});


//PUT http://localhost:3000/users/6483465ba53ee57033b1875d
router.put('/edit/:id', [isAuth], async (req, res, next) => {
    try {
        const { id } = req.params //Recovering the ID from the URL
        const userModify = new User(req.body) //Creating a new User
        userModify._id = id //Adding the id from the URl to the new User URL
        const characterUpdated = await User.findByIdAndUpdate(id , userModify)
        return res.status(200).json(characterUpdated)//Returning the info of the User before it has been changed
    } catch (error) {
        return next(error)
    }
});


//DELETE http://localhost:3000/users/6483465ba53ee57033b1875d
router.delete('/:id', [isAuth], async (req, res, next) => {
    try {
        const {id} = req.params;
        await User.findByIdAndDelete(id);
        return res.status(200).json('User deleted!');
    } catch (error) {
        return next(error);
    }
});




module.exports = router;


