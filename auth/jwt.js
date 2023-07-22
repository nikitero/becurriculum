const LoggedUser = require("../models/LoggedUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register function (registering and login after the user is registered)
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

//Login Function
const login = async (req, res, next) => {
try {
    //Checking if the user exists in DB
    const userInfo = await LoggedUser.findOne({ email: req.body.email })
    //Comparing the entered password with the one that is stored in DB
    if (bcrypt.compareSync(req.body.password, userInfo.password)) {
    //Removing entered password
    userInfo.password = null
    //Creating the token with user id and e-mail
    const token = jwt.sign(
    {
        id: userInfo._id,
        email: userInfo.email
    },
        req.app.get("secretKey"),
    { expiresIn: "1h" }
    );
    //Returning the user info and the bearer token.
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
    
const authorization = req.headers.authorization //if authorization header exists it´s saved in the variable

if(!authorization){ //Checking if the there is an authorization header
    return res.json({
        status: 401,
        message: "Unauthorized",
        data: null
    })
}
const splits = authorization.split(" ")//Splitting authorization response in two string
if( splits.length!=2 || splits[0]!="Bearer"){ //
    return res.json({
        status: 400,
        message: "Bad Request",
        data: null
    })
}
const jwtString = splits[1] // Saving the token in a variable
    
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