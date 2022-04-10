const express = require("express")
const userPath = express.Router()
const {check, validationResult} = require("express-validator")
// File handling
const multer = require("multer")

//  Database management
const {addUser, authenticate} = require("../models/users")

const diskStorage = multer.diskStorage({
    destination : (req, file, callBack) => {
        callBack(null, '../public/uploads')
    },
    filename : (req, file, callBack) => {
        const ext = file.mimetype.split('/')[1]
        callBack(null, `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1E9)}.${ext}`)
    }
})

const option = multer({storage : diskStorage})

// Used in signup route
const validateSignUpDetails = [
    check("password").custom((value, {req}) => {
        if(value === req.body.username){
            throw new Error("Username must be different from password")
        }
        return value
    }).isLength({min : 3}).withMessage("Password must be at least 3 characters long"),

    check("username").isLength({ min : 2}).withMessage("Username cannot be less than 2 characters long").custom((val, {req}) => {
        const bad_chars = ' ,?£$%~#|/'
        for(let char of val) {
            if (bad_chars.includes(char)){
                throw new Error(`Username should not contain ${char} or any character from ${bad_chars}`)
            }
        }
        return val
    })
]

userPath.route('/signup')
    .get((req, res) => {
        res.type('html')
        res.status(200).render('authenticate/signup')
    })

    .post( validateSignUpDetails, async (req, res) => {
        const errs = validationResult(req).array()
        if(errs.length > 0){
            console.log(errs)
            return res.render('authenticate/signup', {errs})
        }
        try{
            const addUserMsg = await addUser(req)
            return res.status(201).render('authenticate/signup', {msg : addUserMsg})
        } catch (err){
            return res.render('authenticate/signup', {'dataBaseErr' : err})
        }  
    })


userPath.route("/signin")
    .get((req, res) => {
        res.set('Content-Type', 'text/html')
        res.status(200).render('authenticate/signin')
    })
    .post(async (req, res) => {
            try{
                const authUserMsg = await authenticate(req)
                res.cookie('user', req.session.user)
                // console.log(req.cookies.user)
                return res.redirect('../../pictures')
                return res.status(201).render('authenticate/signin', {msg : authUserMsg})
            }
            catch(err){
                return res.status(500).render('authenticate/signin', {err : err})
            }


    })


module.exports = {userPath}