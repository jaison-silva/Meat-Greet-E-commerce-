const express = require('express')
const route = express.Router()
const controller = require('../controllers/controller')

route.get('/signup', controller.signup)

route.get('/admin', controller.admin)

route.get('/', controller.index)

route.get('/addcategory', controller.addcategory)

route.get('/addproducts', controller.addproducts)

route.get('/login', controller.login)

route.get('/category', controller.category)

route.get('/products', controller.products)

route.get('/category/products/:id', controller.cate_products)

// route.post('/upload',controller.upload)

// Api routes

route.post('/api_addProducts',controller.addProducts)
route.post('/api_addCategory',controller.addCategory)

module.exports = route