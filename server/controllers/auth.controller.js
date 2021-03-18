const User = require("../models/auth.models")
const expressJWT = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationRequest } = require('express-validator');
const jwt = require('jsonwebtoken');
module.exports = {
    register: (req, res) => {
        const { name, email, password } = req.body;
        res.json({ name, email, password })
    }
}