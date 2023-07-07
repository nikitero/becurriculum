const express = require("express");
const router = express.Router();
//importamos las funciones del controlador y del middleware
const { register, login, logout, isAuth } = require("../auth/jwt");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", [isAuth], logout)

module.exports = router;