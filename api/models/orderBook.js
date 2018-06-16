const mongoose = require('mongoose')

const orderBookSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    book : {type : mongoose.Schema.Types.ObjectId , require : true , ref : 'Book'},
    student : {type : mongoose.Schema.Types.ObjectId , ref : 'Student' , default : null},
    teacher : {type : mongoose.Schema.Types.ObjectId , ref : 'Teacher' , default : null},
    date_from : {type : Date , require : true},
    date_final : {type : Date , require : true},
    status : {type : String , default : "PENDIENTE"} 
})

module.exports = mongoose.model('OrderBook' , orderBookSchema)