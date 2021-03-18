const mongoose = require("mongoose");
const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log(`MongoDB connected: ${connection.connection.host}...`);
}


module.exports = connectDB;