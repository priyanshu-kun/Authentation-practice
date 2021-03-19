const User = require("../models/auth.models")
const expressJWT = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { errorHandler } = require("../helpers/dbErrorHandling");
const nodemailer = require("nodemailer");


const sendMail = ({ email, name, html }, res) => {

    const transporter = nodemailer.createTransport({
        service: 'protonmail',
        port: 8080,
        auth: {
            user: "priyanshuSharma507@protonmail.com",
            pass: process.env.PASSWORD
        }
    })
    console.log(email)
    let mailOptions = {
        from: "priyanshuSharma507@protonmail.com",
        to: email,
        subject: "Account activation link🔮",
        text: `Dear ${name}🤗.`,
        html: html
    }

    transporter.sendMail(mailOptions, (err, data) => {
        console.log(err)
        if (err) return res.status(400).json({
            error: err
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
        else {
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
        }
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
            name,
            html: `
                <h1 style="font-family: sans-serif;">Please click to link to activate</h1>
                <p style="font-family: sans-serif;">${process.env.CLIENT_URL}/user/activate/${token}</p>
                <hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1);"/>
                <p style="font-family: sans-serif;"><b>This email contain sensetive info</b></p>
                <p style="font-family: sans-serif; opacity: 0.6;">${process.env.CLIENT_URL}</p>
            `
        }
        sendMail(mailCreadentials, res)
    }
}