const mongoose = require('mongoose')

const careerSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String , require : true},
    model : {type : String , require : true}
})

module.exports = mongoose.model('Proyector' , careerSchema)