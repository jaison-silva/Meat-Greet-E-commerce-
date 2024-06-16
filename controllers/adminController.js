const cookieParser = require('cookie-parser')
const { Product, Category } = require('../models/model')
const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { computeStyles } = require('@popperjs/core')
const { render } = require('ejs')


exports.adminLogin = (req,res)=>{
    render('adminLogin')
}

exports.adminCheck = async (req, res) => {
    let {email, password} = req.body
    const admin = await adminModel.findOne({email: email})
    console.log(admin)
    try {
        if(admin.email == email && admin.password == password){
        
            const token = {
                email : email
            }
            
            const adminToken = jwt.sign(token, "secret_key",{
                expiresIn: '4h'
            })
    
            res.cookie('adminJwtAuth', adminToken,{
                httpOnly: true,
                maxAge: 4 * 60 * 60 * 1000 // 4 hours in milliseconds
            })
    
            res.redirect('/')
        }else{
            res.render('adminLogin')
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
    
}

exports.adminCategory = async (req, res) => {
    try {
        const data = await Product.find().populate('category')
        console.log(data);
        res.render('admin/adminCategory', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.manageUsers = async (req, res) => {
    try {
        const data = await Product.find().populate('category')
        console.log(data);
        res.render('admin/manageUsers', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.adminProducts = async (req, res) => {
    try {
        const data = await Product.find().populate('category')
        console.log(data);
        res.render('admin/adminProducts', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}


exports.addcategory = (req, res) => {
    res.render('admin/addCategory')
}

exports.addproducts = async (req, res) => {
    try {
        const data = await Category.find({}).select('name');
        console.log(data)
        res.render('addproducts', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.addProducts = (req, res) => {
    try {
        let { name, description, rating, rate, category } = req.body
        const data = new Product({ name, description, rating, rate, category })

        data.save()
            .then(() => {
                console.log("product added")
                res.send("product added")
            })
            .catch((err) => {
                console.log("failed to add product ", err)
                res.send("failed to add product")
            })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.addCategory = (req, res) => {
    try {
        let { name, description, rate } = req.body

        const data = Category({
            name,
            description,
            rate
        })

        data.save()
            .then(() => {
                console.log("data saved to db");
                res.send("data sent")
            })
            .catch((err) => {
                console.log("data not saved to db", err)
                res.send(err)
            })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}
