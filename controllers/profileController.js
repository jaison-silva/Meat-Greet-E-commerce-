const Category = require('../models/categoryModel')
const Product = require('../models/productModel')
const userModel = require('../models/userModel')
const orderModel = require('../models/orderModel')
const addressModel = require('../models/addressModel')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')


exports.profile = async (req, res) => {
    // Extract the JWT token from the cookies
    const token = req.cookies.userJwtAuth;

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    console.log(token + " this is the token");

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, 'secret_key'); // Use the same secret key used to sign the token
        console.log(decoded.email + " this is the decoded ");

        // Find the user in the database using the decoded email
        const user = await userModel.findOne({ email: decoded.email });
        console.log(user + " this is the user");

        if (!user) {
            return res.status(400).send('User not found');
        }

        // Render the profile page with user details
        return res.render('user/profile/Profile', { user });
    } catch (ex) {
        return res.status(400).send('Invalid Token: ' + ex.message);
    }
};

exports.address = async (req, res) => {
    // Extract the JWT token from the cookies
    const token = req.cookies.userJwtAuth;

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    // console.log(token + " this is the token");

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, 'secret_key'); // Use the same secret key used to sign the token
        console.log(decoded.email + " this is the decoded ");

        // Find the user in the database using the decoded email
        const user = await userModel.findOne({ email: decoded.email });
        console.log(user + " this is the user");

        const vilasam = await addressModel.find({ user: user._id })

        if (!user) {
            return res.status(400).send('User not found');
        }

        // Render the profile page with user details
        return res.render('user/profile/Address', { user, vilasam });
    } catch (ex) {
        return res.status(400).send('Invalid Token: ' + ex.message);
    }
};

exports.addAdress = async (req, res) => {

    const token = req.cookies.userJwtAuth;

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    console.log(token + " this is the token");

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, 'secret_key'); // Use the same secret key used to sign the token
        console.log(decoded.email + " this is the decoded ");

        // Find the user in the database using the decoded email
        const user = await userModel.findOne({ email: decoded.email });
        console.log(user + " this is the user");

        if (!user) {
            return res.status(400).send('User not found');
        }

        const { name, mobileNumber, pincode, locality, address, district, state, landmark, alternateMobile } = req.body

        const addAddress = new addressModel({
            user: user._id,
            name, mobileNumber, pincode, locality, address, district, state, landmark, alternateMobile
        })

        addAddress.save()
            .catch((err) => {
                console.log(err)
            })

        res.redirect('/user/address')

    } catch (ex) {
        return res.status(400).send('Invalid Token: ' + ex.message);
    }
}


exports.deleteAddress = async (req, res) => {
    try {
        const id = req.params.id
        let response = await addressModel.findByIdAndDelete(id)
        if (!response) {
            console.log("error in finding the user")
            res.status(500).json({ message: 'Server Error' })
        } else {
            console.log("SUcess")
            res.status(200).json({ message: "Successfully deleted" })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send("Failed to delete")
    }
}

exports.editAddress = async (req, res) => {
    try {
        const id = req.params.id
        const dbData = await addressModel.findOne({ _id: id })
        res.render('user/profile/editAddress', dbData)
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "update data page render error" })
    }
}

exports.updateAddress = async (req, res) => {
    const token = req.cookies.userJwtAuth;

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    // console.log(token + " this is the token");

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, 'secret_key'); // Use the same secret key used to sign the token
        console.log(decoded.email + " this is the decoded ");

        // Find the user in the database using the decoded email
        const user = await userModel.findOne({ email: decoded.email });
        // console.log(user + " this is the user");

        if (!user) {
            return res.status(400).send('User not found');
        }

        const { name, mobileNumber, pincode, locality, address, district, state, landmark = '', alternateMobile = '' } = req.body;
        console.log(req.body.name)

        const response = await addressModel.findOneAndUpdate({ user: user._id }, { name, mobileNumber, pincode, locality, address, district, state, landmark, alternateMobile }, { new: true })

        if (!response) {
            console.log("not updated")
            res.status(500).json({ message: " not updated" })
        } else {
            res.redirect('/user/address')
        }

    } catch (ex) {
        return res.status(400).send('Invalid Token: ' + ex.message);
    }
}


exports.orders = async (req, res) => {
    const token = req.cookies.userJwtAuth;

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    try {
        const decoded = jwt.verify(token, 'secret_key');
        console.log(decoded.email + " this is the decoded ");

        // Find the user in the database 
        const user = await userModel.findOne({ email: decoded.email });
        const orders = await orderModel.find().populate('items.productId');
        // console.log(orders)

        res.render('user/profile/myOrders', { orders, user })
    } catch (ex) {
        return res.status(400).send('Invalid Token: ' + ex.message);
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        console.log("triggered")
        const id = req.params.id

        const response = await orderModel.findByIdAndUpdate(id, {
            status: "Cancelled",
            paymentStatus: "Cancelled"
        }, { new: true })

        const token = req.cookies.userJwtAuth;
        const decoded = jwt.verify(token, 'secret_key');

        const amount = await orderModel.findOne({_id : id})

        console.log(amount + " this is the order model document")

        const user = await userModel.findOneAndUpdate(
            { email: decoded.email },
            { $inc: { wallet: +amount.totalAmount } }, // Ensure +id.totalamount is a valid number
            { new: true } // To return the updated document
        );

        if (response) {
            res.json({ message: "Success" })
        }

    } catch (e) {
        console.log("error" + e)
        res.status(500).json({ message: "fail" })
    }
}

exports.updateProfile = async (req, res) => {
    const token = req.cookies.userJwtAuth;
    const decoded = jwt.verify(token, 'secret_key');
    console.log(decoded.email + " this is the decoded ");

    const user = await userModel.findOne({ email: decoded.email });
    const newName = req.body.name
    console.log(newName)

    const response = await userModel.findByIdAndUpdate(user._id, {
        name: newName
    }, { new: true })

    if (response) {
        res.status(200).json({ message: "success" })
    } else {
        res.status(500).json({ message: "fail" })
    }

}