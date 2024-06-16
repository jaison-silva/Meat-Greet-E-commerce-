const express = require('express')
const route = express.Router()
const controller = require('../controllers/adminController')


route.get('/manageUsers', controller.manageUsers)

route.get('/adminCategory', controller.adminCategory)

route.get('/adminProducts', controller.adminProducts)

route.get('/addcategory', controller.addcategory)

route.get('/addproducts', controller.addproducts)

route.get('/adminCheck', controller.adminCheck)

route.get('/adminLogin', controller.adminLogin)

///API

route.post('/api_addProducts',controller.addProducts)
route.post('/api_addCategory',controller.addCategory)

module.exports = route