const express = require('express')
const route = express.Router()
const controller = require('../controllers/controller')

route.get('/signup', controller.signup)

route.get('/login', controller.login)

/////user side 

route.get('/', controller.index)

// route.post('/upload',controller.upload)

route.get('/category', controller.category)

route.get('/products', controller.products)

route.get('/category/products/:id?', controller.cate_products)   //// question mark aded

route.get('/productDetailed', controller.productDetailed)

//////admin side 

route.get('/admin', controller.admin)

route.get('/manageUsers', controller.manageUsers)

route.get('/adminCategory', controller.adminCategory)

route.get('/adminProducts', controller.adminProducts)

route.get('/addcategory', controller.addcategory)

route.get('/addproducts', controller.addproducts)


// Api routes

route.post('/api_addProducts',controller.addProducts)
route.post('/api_addCategory',controller.addCategory)

module.exports = route