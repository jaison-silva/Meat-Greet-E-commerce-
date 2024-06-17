const mongoose = require('mongoose')

const schema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

exports.adminModel = mongoose.model('admin',schema)