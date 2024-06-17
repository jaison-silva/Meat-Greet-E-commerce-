const { Product, Category } = require('../models/model')
const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


exports.loginPage = (req, res) => {
    res.render('user/login');
}

exports.api_login = async (req, res) => {
    let { email, password } = req.body;
    console.log(email, password);

    try {
        const user = await userModel.findOne({ email: email });
        console.log(user);

        if (!user) {
            return res.redirect('/user/login?msg=email'); // No user found with the given email
        }

        if (user.password === password) {
            const token = { email: email };
            const userToken = jwt.sign(token, "secret_key", {
                expiresIn: '4h'
            });

            res.cookie('userJwtAuth', userToken, {
                httpOnly: true,
                maxAge: 4 * 60 * 60 * 1000 // 4 hours in milliseconds
            });

            return res.redirect('/?msg=success');
        } else {
            return res.redirect('/user/login?msg=password'); // Password does not match
        }
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send('Internal Server Error');
    }
};

exports.logout = async(req,res) => {
    try{
        res.clearCookie('userJwtAuth');
        res.redirect('/?msg=loggedout');
    }catch(e){  
        console.log(e);
        res.status(500).send("Error");
    }
}

exports.signup = (req, res) => {
    res.render('user/signup')
}

exports.sendOtp = (req, res) => {
    try {

        console.log("Triggered! back")
        let email = req.body.email;
        console.log(email + "back");

        // otp verification
        const transport = {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "jaisonsilva303@gmail.com",
                pass: "bolg wysf cirq dxsa"
            }
        }

        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        console.log(otp);

        let transporter = nodemailer.createTransport(transport);
        const mailContent = {
            from: "jaisonsilva303@gmail.com",
            to: `${email}`,
            subject: "This is the otp for the sign up for MEAT & GREET",
            text: `Your otp is: ${otp}`
        }

        transporter.sendMail(mailContent, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to send OTP' }); // Send an error response
            } else {
                // Store the OTP in session or database
                res.cookie('otp', otp, { maxAge: 30000, httpOnly: true })
                res.json({ message: 'OTP sent successfully' }); // Send a success response
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
};

exports.verifyOtp = (req, res) => {
    try {
        let { otp } = req.body;
        console.log('Triggered verifyOtp with OTP:', otp);

        const storedOtp = req.cookies.otp;

        if (!storedOtp) {
            console.log('expired')
            return res.status(200).json({ message: "Expired" });
        }

        if (otp === storedOtp) {
            console.log('veri')
            return res.status(200).json({ message: "Verified" });
        } else {
            console.log('invvalid')
            return res.status(200).json({ message: "Invalid" });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
};

exports.registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const data = new userModel({ name, email, password });

        await data.save();
        console.log("Data saved to DB");
        res.clearCookie('otp');

        const token = {
            email: email
        }

        const userToken = jwt.sign(token, "secret_key", {
            expiresIn: '4h'
        });

        res.cookie('userJwtAuth', userToken, {
            httpOnly: true,
            maxAge: 4 * 60 * 60 * 1000 // 4 hours in milliseconds
        });

        res.redirect('/');
    } catch (err) {
        console.error("There was an error saving the data: ", err);
        res.status(500).send("There was an error saving the data");
    }
}

exports.category = async (req, res) => {
    try {
        const data = await Category.find()
        if(req.cookies && req.cookies.userJwtAuth){
            res.render('user/category', { data, user:true })
        }else{
            res.render('user/category', { data, user:false })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.products = async (req, res) => {
    try {
        const data = await Product.find().populate('category')
        console.log(data);
        if(req.cookies && req.cookies.userJwtAuth){
            res.render('user/products', { data, user:true })
        }else{
            res.render('user/products', { data, user:false })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.cate_products = async (req, res) => {
    try {
        const data = await Product.find({ category: req.params.id }).populate('category')
        res.render('user/products', { data })
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

exports.productDetailed = async (req, res) => {
    try {
        // const data = Product.find({Category:req.params.id})
        res.render('user/productDetailed')
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}