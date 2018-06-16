const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String , require : true},
    matricula : {type : String , require : true , unique : true},
    phoneNumber : {type : Number , require : true},
    orders : {type : mongoose.Schema.Types.ObjectId , ref : 'OrderBook' , default : null},    
})

module.exports = mongoose.model('Teacher' , teacherSchema)