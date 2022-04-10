const express = require("express")

const addPics = express.Router()
const {addPictureStory, getUserImages } = require("../models/users")

// Handling User File Uploads
const multer = require("multer")

let fileStorageBaseDir = process.env.fileStorageBaseDir

const diskStorage = multer.diskStorage({
    destination : (req, file, callBack) => {
        callBack(null, './public/uploads/')
    },
    filename : (req, file, callBack) => {
        const ext = file.mimetype.split('/')[1]
        callBack(null, `${file.originalname}-${Math.floor(Math.random() * 1E9)}.${ext}`)
    }
})

const options = multer({storage : diskStorage})

addPics.route('/')
    .get((req, res) => {
       
        const signedInUser = req.session.user || req.cookies.user || null
        if(!signedInUser){
            return res.redirect(307, '../users/signin')
        }
        
        res.locals.user = req.session.user || req.cookies.user
        return res.status(200).render('pictures/addPictures')
        
    })
    .post(options.fields([{ name : 'picture', maxCount : 1 }]), async (req, res) => {
        // console.log(imageStory)
        try{

            const addStory = await addPictureStory(req)
            return res.status(201).render('pictures/addPictures', { msg : addStory})
        }
        catch(err){
            console.log(err)
            
            return res.status(404).render('pictures/addPictures', { err})
        }
    })


addPics.get('/allPosts', async (req, res) => {
    res.locals.fileBaseDir = fileStorageBaseDir
    const userImages = await getUserImages(req)
    console.log(userImages)
    return res.status(200).render('pictures/viewPictures', { userImages })
    res.status(200).json(userImages)
})




module.exports = {addPics}