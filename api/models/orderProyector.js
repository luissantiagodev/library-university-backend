const mongoose = require('mongoose')

const orderProyector = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    proyector : {type : mongoose.Schema.Types.ObjectId , require : true , ref : 'Proyector'},
    teacher : {type : mongoose.Schema.Types.ObjectId , ref : 'Teacher' , require : true},
    date : {type : String , require : true},
    initialHour : {type : String , require : true},
    finalHour : {type : String , require : true},
    place : {type : String , require : true}
})

module.exports = mongoose.model('OrderProyector' , orderProyector)