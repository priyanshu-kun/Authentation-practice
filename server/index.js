require('dotenv').config({
    path: './config/config.env'
})
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./db/db.js");
const app = express();

connectDB();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}


const authRouter = require("./routes/auth.router")
app.use('/api', authRouter);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "You lost Man or Women I don't know who are you, But You lost try to make request on different endpoints!🙂"
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`The App is alive on - http://localhost:${port}`)
})