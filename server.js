const express = require('express')
const app = express()

const path = require('path')
const dotenv = require('dotenv')
const nocache = require('nocache')
const mongoose = require('mongoose')
const route = require('./routes/routes')

app.set('view engine', 'ejs')
dotenv.config({ path: 'config.env' })

app.use(nocache())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/assets', express.static(path.join(__dirname, '/assets')))
// app.use('/assets/css',express.static(path.resolve('/src/views/css')))

async function serverOn() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Meat&Greet')
        console.log("db connected")
        app.listen(process.env.PORT || 9999, () => {
            console.log("server running at http://localhost:3000")
        })
    }catch(error){
        console.log(`failed to start the server. ${error}`)
    }
}

serverOn()

app.use('/',(req, res, next) => {
    console.log(`Request received method : ${req.method} and route : ${req.url}`);
    next(); // Pass control to the next middleware
});

app.use('/',route)
