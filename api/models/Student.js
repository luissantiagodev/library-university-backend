const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String , require : true},
    matricula : {type : String , require : true},
    phoneNumber : {type : Number , require : true},
    password : {type : String , require : true}
})

module.exports = mongoose.model('Student' , studentSchema)