const express = require('express')
const app = express()

const path = require('path')
const dotenv = require('dotenv')
const nocache = require('nocache')
const mongoose = require('mongoose')
const route = require('./routes/routes')
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const multer = require('multer')

app.set('view engine', 'ejs')
dotenv.config({ path: 'config.env' })

//multer storage

const storageEngine = multer.diskStorage({
    destination: '/uploads',
    filename: function(req, file, cb){
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storageEngine
}).array('// use the name of the input tag',3)


app.use(nocache())
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.use(express.urlencoded({ extended: true }))
app.use('/assets', express.static(path.join(__dirname, '/assets')))
// app.use('/assets/css',express.static(path.resolve('/src/views/css')))

async function serverOn() {
    try {
        await mongoose.connect(process.env.MONGO_URI ||'mongodb://localhost:27017/Meat&Greet')
        console.log("db connected")
    }catch(error){
        console.log(`failed to start the server. ${error}`)
    }
}

serverOn()

app.use('/',(req, res, next) => {
    console.log(`Request received method : ${req.method} and route : ${req.originalUrl}`);
    next(); // Pass control to the next middleware
});

app.use('/',route);
app.use('/user',userRoute);
app.use('/admin',adminRoute);

app.use("**", (req,res)=>{
    res.send("Page not found");
});

app.listen(process.env.PORT || 9999, () => {
    console.log("server running at http://localhost:3000")
})