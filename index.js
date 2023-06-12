const express = require("express");
const logError = require('./utils/log')
const User = require('./models/User');


//DataBase
require('./db');

//Routes
const userRoutes = require('./routes/user.routes');

//Server config
const PORT = 3000;
const server = express();
const router = express.Router();

//Middlewares
server.use(express.json())
server.use(express.urlencoded({ extended:false })) 
server.use("/", router);
server.use('/users', userRoutes);

//Control de errores
server.use('*', (req, res, next) => {
    const msg = 'Route not found'
    const error = new Error(); 
    error.status = 404;
    next(error); 
    const log = `${msg}
    ${req.path}
    ${new Date().toISOString()}\n`;
    logError(log);
    res.status(404).send(msg);
  });



//Server
server.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
});
