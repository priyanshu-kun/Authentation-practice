const mongoose = require("mongoose");
const crypto = require("crypto");

const userScheama = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

// Virtual Password
userScheama.virtual('password').set(function (password) {
    console.log("This in set function: ", this);
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
}).get(function () {
    console.log("This in get function: ", this)
    return this._password
})

userScheama.methods = {
    // Generate Salt
    makeSalt: () => {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    },
    // Encrypt password
    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        }
        catch (e) {
            return ''
        }
    },
    // Compare password between plain from user and hashed
    authenticate: function (plainPassword) {
        return this.encryptPassword(plainPassword) === this.hashed_password
    }

}

module.exports = mongoose.model('User', userScheama);