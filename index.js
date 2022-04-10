const express = require("express")
const multer = require("multer")
const dotenv = require("dotenv").config()
const session = require("express-session")
const cookieParser = require("cookie-parser")

const {userPath} = require("./controller/authenticate")
const {addPics} = require('./controller/addPictures')

const app = express()
// Persisting data with session and cookieParser
app.use(session({
  secret : process.env.secret,
  resave : false,
  saveUninitialized : false
}))
app.use(cookieParser())

// View Engine Set Up
app.set("view engine", 'ejs')

//  Handling Form data 
app.use(express.json())
app.use(express.urlencoded( {extended : true}))

// Accessing files in the public folder
app.use('/static', express.static('public'))

// Routing
app.use('/users', userPath)
app.use('/pictures', addPics)


const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log("Listening on PORT : "+ PORT))

