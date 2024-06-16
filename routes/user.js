const express = require('express')
const route = express.Router()
const controller = require('../controllers/userController')

route.get('/signup', controller.signup)

// route.post('/upload',controller.upload)

route.get('/category', controller.category)

route.get('/products', controller.products)

route.get('/category/products/:id?', controller.cate_products)   //// question mark aded

route.get('/productDetailed', controller.productDetailed)

route.post('/registerUser', controller.registerUser)


/// API

route.post('/sendOtp',controller.sendOtp)
route.post('/verifyOtp',controller.verifyOtp)
route.post('/api_login',controller.api_login)

module.exports = route