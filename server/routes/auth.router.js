const express = require("express");
const router = express.Router();
const { register, activationController, login } = require("../controllers/auth.controller.js");
const {
    validRegister,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require("../helpers/auth.js");

router.post('/register', validRegister, register);
router.post('/login', validLogin, login);
router.post('/activation', activationController);


module.exports = router;