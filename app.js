const express = require('express');
const app = express();
require("dotenv").config()
const path = require("path")
const books = require("./routes/books")
const cartUsers = require("./routes/cartUsers")
const connectionMongoDB = require("./mongooseDB/ConnectionMongoose");
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/upload/images/",express.static(path.join(__dirname, "tmp")))

app.use(books)
app.use(cartUsers)


connectionMongoDB(app)