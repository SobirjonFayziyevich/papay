
const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
// const mongodb = require("mongodb");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URL;
    // "mongodb+srv://pirmatovsobir23:KnSHlq9VR0dnUTzc@cluster0.kscois6.mongodb.net/Papays";
// mongodb.connect(
mongoose.connect(
    connectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, goose) => {
        if (err) console.log("ERROR on connection MongoDB");
        else {
            console.log("MongoDB connection succeed");
            console.log(goose);   // buyerda mongoose clientni beradi.
            //  module.exports = client;
             const app = require("./app");
            const server = http.createServer(app);
            let PORT = process.env.PORT || 3000;
            server.listen(PORT, function () {
                console.log(`The server is running successfully on port: ${PORT}, http://localhost:${PORT}`
                );
            });
        }

    });