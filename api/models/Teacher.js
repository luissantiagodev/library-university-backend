const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String , require : true},
    matricula : {type : String , require : true},
    phoneNumber : {type : Number , require : true},
    password : {type : String , require : true},
})

module.exports = mongoose.model('Teacher' , teacherSchema)