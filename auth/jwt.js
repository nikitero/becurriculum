// Cargamos el modelo 
const LoggedUser = require("../models/LoggedUser");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");



const register = async (req, res, next) => {
try {
    const existingUser = await LoggedUser.findOne({ email: req.body.email });

    if (existingUser) {
        return res.status(400).json({
          status: 400,
          message: 'User already exists',
        });
      }

    const newUser = new LoggedUser();
    newUser.email = req.body.email;
    const pwdHash = await bcrypt.hash(req.body.password, 10); //Encryptinh the password
    newUser.password = pwdHash;
    
    const userDb = await newUser.save();
    
    const token = jwt.sign({ userId: userDb._id }, 'secretKey');

    return res.json({
        status: 201,
        message: 'User created successfully and logged in!',
        data: userDb,
        token:token
    });
} catch (err) {
    return next(err);
}
}

const login = async (req, res, next) => {
try {
    //Buscamos al user en bd
    const userInfo = await LoggedUser.findOne({ email: req.body.email })
    //Comparamos la contraseña
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      //eliminamos la contraseña del usuario
    userInfo.password = null
      //creamos el token con el id y el name del user
    const token = jwt.sign(
    {
        id: userInfo._id,
        email: userInfo.email
    },
        req.app.get("secretKey"),
    { expiresIn: "1h" }
    );
      //devolvemos el usuario y el token.
    return res.json({
        status: 200,
        message: 'Logged in sucessfully!',
        data: { user: userInfo, token: token },
    });
    } else {
    return res.json({ status: 400, message: HTTPSTATUSCODE[400], data: null });
    }
} catch (err) {
    return next(err);
}
}
//logout function. Equals token to null.
const logout = (req, res, next) => {
try {
    return res.json({
        status: 200,
        message: 'Logged out succesfully',
        token: null
    });
} catch (err) {
    return next(err)
}
}


const isAuth = (req, res, next) => {
    
const authorization = req.headers.authorization //si en el header existe authorization lo guardamos en una variable. 
//Esta tiene el formato: bearer token
    
if(!authorization){ //Se comprueba que exista autorización
    return res.json({
        status: 401,
        message: "Unauthorized",
        data: null
    })
}

const splits = authorization.split(" ")//troceamos el token en dos partes
//en la primera quitamos la palabra Bearer
if( splits.length!=2 || splits[0]!="Bearer"){ //
    return res.json({
        status: 400,
        message: "Bad Request",
        data: null
    })
}

const jwtString = splits[1] // En esta variable guardamos la parte que contiene la información del token
    
try {
    var token = jwt.verify(jwtString, req.app.get("secretKey")); //verificamos que el token tiene una firma correcta

} catch(err){
    return next(err)
    }

    const authority = { 
        id   : token.id,
        name : token.name
    }
    req.authority = authority
    next()
}




module.exports = {
register,
isAuth,
login,
logout
}