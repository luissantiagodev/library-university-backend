const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    matricula : String
})

module.exports = mongoose.model('Student' , studentSchema)