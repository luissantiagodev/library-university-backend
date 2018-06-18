const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type : String , require : true},
    publisher : {type : String , require : true},
    num_of_edicion : {type : Number , require : true},
    author : {type : String , require : true},
    estante : {type : mongoose.Schema.Types.ObjectId , ref : 'Estante'  , require : true},
    level : {type : String , require : true},
    quantity : {type : Number , require : true},
})

module.exports = mongoose.model('Book' , bookSchema)