const { Product, Category } = require('../models/model')

module.exports.signup = (req, res) => {
    res.render('signup')
}

module.exports.admin = (req, res) => {
    res.render('admin')
}

module.exports.addcategory = (req, res) => {
    res.render('addcategory')
}

module.exports.index = (req, res) => {
    res.render('index')
}

module.exports.addproducts = async (req, res) => {
    try{
        const data = await Category.find({}).select('name');
        console.log(data)
        res.render('addproducts',{data})}catch(err){
            console.log(err)
            res.status(500).send(err)
        }
}

module.exports.login = (req, res) => {
    res.render('login')
}

module.exports.category = async (req, res) => {
    try{
        const data = await Category.find()
        res.render('category', { data })}catch(err){
            console.log(err)
            res.status(500).send(err)
        }
}

module.exports.products = async (req, res) => {
    try{
        const data = await Product.find().populate('category')
        console.log(data);
        res.render('products',{data})
    }catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

module.exports.cate_products = async (req, res) => {
    try{
        const data = await Product.find({category:req.params.id}).populate('category')
        res.render('products',{data})}catch(err){
            console.log(err)
            res.status(500).send(err)
        }
}

// module.exports.upload =  (req, res, next) => {
//     // res.render('login.ejs')
//     let { name, age } = req.body

//     data = new model.userSchema({
//         name: name,
//         age: age
//     })

//     data.save()
//         .then(() => {
//             console.log("done")
//             res.send("we saved the data bro")
//         })
//         .catch(()=>{
//             console.log("fucked up")
//             next(err)
//         })
// }


module.exports.addProducts = (req, res) => {
    try{
        let { name, description, rating, rate ,category} = req.body
        const data = new Product({ name, description, rating, rate, category})
    
        data.save()
            .then(() => {
                console.log("product added")
                res.send("product added")
            })
            .catch((err) => {
                console.log("failed to add product ", err)
                res.send("failed to add product")
            })}catch(err){
                console.log(err)
                res.status(500).send(err)
            }
}

module.exports.addCategory = (req, res) => {
    try{
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
            })}catch(err){
                console.log(err)
                res.status(500).send(err)
            }
}

