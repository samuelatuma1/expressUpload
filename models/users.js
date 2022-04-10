const users = require("./users.json")
const fs = require("fs")
let sampleUser = {
    'username' : {
        'password' : '12345',
        'images' : [
            {"story":"My story",
            "imgName":"postgres.png-304267146.png",
            "imgSrc":"public\\uploads\\postgres.png-304267146.png",
            "moreInfo":{"fieldname":"picture","originalname":"postgres.png","encoding":"7bit","mimetype":"image/png","destination":"./public/uploads","filename":"postgres.png-304267146.png", "path":"public\\...","size":11608,
            "date" : "2020-21-01..."
        }}
        ]
    }
}

const getUserImages = (req) => {
    return new Promise((resolve, reject) => {
        const signedInUser = req.session.user ? req.session.user : req.cookies.user ? req.cookies.user : null
        if(!signedInUser){
            return reject('No User signed In')
        }
        const images = users[signedInUser].images
        images.reverse()
        return resolve(images)
    })


    
}

/**
 * 
 * @param {Object} req The request object 
 * @returns {Promise} Promise with resolve('User Created Successfully') or reject('dataBaseErr : User with username already exists')
 */
const addUser = (req) => {
    const addPromise = new Promise((res, rej) => {
        let username = req.body.username 
        console.log(users)
        if(!users.hasOwnProperty(username)) {
            users[username] = {
                password : req.body.password,
                images : []
            }
            
            fs.writeFile(__dirname + '/users.json', JSON.stringify(users), (err) => {
                if (err) console.log(err);
                return res('User Created Successfully')
            })
        }
        else{
            
            return rej('dataBaseErr : User with username already exists')
        }
    })

    return addPromise
}

/**
 * @param {Object} req The request object
 * @returns {Promise} Promise with resolve("User signed In successfully") or reject("dataBaseErr : No user with username found") or reject("dataBaseErr : Password Incorrect")
 */
const authenticate = (req) => {
    return new Promise((resolve, rej) => {
        const username = req.body.username
        const password = req.body.password

        if(!users.hasOwnProperty(username)){
            return rej("dataBaseErr : No user with username found")
        }
        let user = users[username]
        if(user.password === password){
            req.session.user = username
            return resolve("User signed In successfully")
        }
        return rej("dataBaseErr : Password Incorrect")
    })
}

/**
 * 
 * @param { Object } req : -> The request Object. Expecting a files field
 * @returns promise which resolves with resolve('Picture Story added successfully') and rejects with reject('No user signed in') 
 */
const addPictureStory = (req, imageStory) => {
    return new Promise((resolve, reject) => {
        let imageStory = req.files.picture[0]

        let fullStory = {
            story : req.body.story || 'No Caption',
            imgName : imageStory.filename,
            imgSrc : imageStory.path,
            moreInfo : imageStory,
            date : new Date()

        }
        const signedInUser = req.session.user ? req.session.user : req.cookies.user || null
        if(!signedInUser){
            return reject('No user signed in')
        }
         else {
            users[signedInUser].images.push(fullStory)
            fs.writeFile(__dirname + '/users.json' , JSON.stringify(users), (err) => {
                if(err) console.log(err);
                return resolve('Picture Story added successfully')
            })
        }
    })
}


module.exports = {addUser, authenticate, addPictureStory, getUserImages }