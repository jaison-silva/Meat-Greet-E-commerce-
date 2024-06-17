const express = require('express')
const route = express.Router()
const controller = require('../controllers/adminController')

route.post('/login', controller.login);
route.get('/logout', controller.logout);

route.get('/users', controller.manageUsers)

route.get('/products', controller.adminProducts);
route.get('/category', controller.adminCategory)

route.get('/addcategory', controller.addcategory)

route.get('/addproducts', controller.addproducts)

route.get('/adminLogin', controller.adminLogin)

// route.get('/logout', controller.logout)

///API

route.post('/usertoggle/:userId', controller.toggleUser);

route.post('/addProducts',controller.addProducts)
route.post('/addCategory',controller.addCategory)

module.exports = route