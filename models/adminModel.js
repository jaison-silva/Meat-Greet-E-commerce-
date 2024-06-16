const mongoose = require('mongoose')

const schema = mongoose.Schema({
    email: String,
    Password: String
})

const model = mongoose.model('admin',schema)

module.exports = model