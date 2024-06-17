const { Product, Category } = require('../models/model')
const userModel = require('../models/userModel')
const {adminModel} = require('../models/adminModel')
const jwt = require('jsonwebtoken')


exports.adminLogin = (req,res)=>{
    res.render('admin/adminLogin')
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        console.log("Login triggered with:", email, password);

        // Find admin by email
        const admin = await adminModel.findOne({ email: email });
        console.log("Admin found:", admin);

        // Check if admin exists and passwords match
        if (admin && password === admin.password) {       //// confused with admin === admin.password since admin is an object
            console.log("Admin verified!");

            // Create a JWT token
            const token = { email: email };
            const adminToken = jwt.sign(token, "secret_key", { expiresIn: '4h' });

            // Set the JWT as a cookie
            res.cookie('adminJwtAuth', adminToken, {
                httpOnly: true,
                maxAge: 4 * 60 * 60 * 1000 // 4 hours in milliseconds
            });

            // Redirect to admin dashboard
            res.redirect('/?msg=success');
        } else {
            // Invalid credentials, re-render login page
            res.redirect('/admin/adminLogin/?msg=invalid');
        }
    } catch (err) {
        console.log("Error during login:", err);
        res.status(500).send(err);
    }
};

exports.logout = (req,res) => {
    try{
        res.clearCookie("adminJwtAuth");
        res.redirect('/?msg=loggedout');
    }catch(e){
        console.log(e);
        res.status(500).send("Error");
    }
}

exports.adminCategory = async (req, res) => {
    try {
        const data = await Category.find({})
        console.log(data);
        res.render('admin/adminCategory', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.manageUsers = async (req, res) => {
    try {
        const data = await userModel.find({})
        // console.log(data);
        res.render('admin/manageUsers', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.toggleUser = async(req,res) => {
    const userId = req.params.userId;
    console.log("Troggered!")

    try {
      // Find user by userId (replace this with your actual logic)
      const user = await userModel.findById(userId);
      console.log(user)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Toggle user status (example: invert the current status)
      user.status = !user.status;
  
      // Save updated user status
      await user.save();

      console.log(user.status)
  
      // Send response
      res.json({ message: 'User status updated successfully' });
    } catch (error) {
      console.error('Error toggling user status:', error);
      res.status(500).json({ message: 'Internal server error' });
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
        res.render('admin/addproducts', { data })
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
                res.redirect("/admin/products?msg=added");
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
                res.redirect('/admin/category?msg=added');
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
