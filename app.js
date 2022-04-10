const express = require("express")
const app = express()
const multer = require("multer")

app.use(express.urlencoded({extended : true}))
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs')
const diskStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename : (req, file, cb)  => {
        const fileType = file.mimetype.split("/")[1]
        cb(null , `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1E9)}.${fileType}`)
    }
})

const fileOption = multer({storage : diskStorage})
app.route('/addImg')
    .get((req, res) => {
        res.type('html')
        res.status(200).render('index')
    })
    .post(fileOption.single('file'), (req, res) => {
        res.json({msg : "File Saved successfully"})
        console.log(req.file)
    })

app.listen(8000, () => console.log("Listening"))