const User = require("../models/auth.models")
const expressJWT = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require("../helpers/dbErrorHandling");
const nodemailer = require("nodemailer");


const sendMail = ({ email, html }, res) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })


    let mailOptions = {
        from: "priyanshushrama709@gmail.com",
        to: email,
        subject: "Account activation link🔮",
        html: html
    }

    transporter.sendMail(mailOptions, (err, data) => {
        console.log(err)
        if (err) return res.status(400).json({
            error: errorHandler(err)
        })
        res.json({
            message: `Email has been sent to ${email}`
        })
    })

}


module.exports = {
    register: (req, res) => {
        const { name, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            const firstError = errors.array().map(error => error.msg)[0];
            return res.status(422).json({ error: firstError })
        }

        User.findOne({
            email
        }).exec((error, user) => {
            if (error) return res.status(500).json({
                error: "Internal server error!"
            })
            if (user) {
                return res.status(400).json({
                    error: "Email is taken"
                })
            }
        })

        // generate token
        const token = jwt.sign(
            {
                name,
                email,
                password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '15m'
            }
        )
        const mailCreadentials = {
            email,
            html: `
            <h1 style="font-family: sans-serif;">Please click to link to activate</h1>
            <p><a href="#" style="font-family: sans-serif;">${process.env.CLIENT_URL}/user/activate/${token}</a></p>
            <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1);"/>
            <p style="font-family: sans-serif;"><b>This email contain sensetive info</b></p>
            <p style="font-family: sans-serif; opacity: 0.6;">${process.env.CLIENT_URL}</p>
        `
        }
        sendMail(mailCreadentials, res,);
    },

    // account activation controller and save data in user db
    activationController: (req, res) => {
        const { token } = req.body;
        if (token) {
            jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decode) => {
                if (err) return res.status(401).json({
                    error: 'Expired Token. Signup again'
                })

                const { name, email, password } = jwt.decode(token);
                const user = new User({
                    name,
                    email,
                    password
                })
                user.save((err, user) => {
                    if (err) return res.status(401).json({
                        error: errorHandler(err)
                    })
                    return res.json({
                        success: true,
                        message: "Signup success"
                    })
                })
            })
        }
        else {
            return res.status(500).json({
                message: 'error happening please try again!'
            })
        }
    },

    login: (req, res) => {
        const { email, password } = req.body;
        console.log(email, password)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array().map(error => error.msg)[0];
            return res.status(422).json({
                errors: firstError
            });
        } else {
            // check if user exist
            User.findOne({
                email
            }).exec((err, user) => {
                if (err || !user) {
                    return res.status(400).json({
                        errors: 'User with that email does not exist. Please signup'
                    });
                }
                // authenticate
                if (!user.authenticate(password)) {
                    return res.status(400).json({
                        errors: 'Email and password do not match'
                    });
                }
                // generate a token and send to client
                const token = jwt.sign(
                    {
                        _id: user._id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '7d'
                    }
                );
                const { _id, name, email, role } = user;

                return res.json({
                    token,
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                });
            });
        }
    }
}