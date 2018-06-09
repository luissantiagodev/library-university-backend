const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {type : String , require : true},
    publisher : {type : String , require : true},
    num_of_edicion : {type : Number , require : true},
    ISBN : {type : String , require : true},
    author : {type : String , require : true},
})

module.exports = mongoose.model('Book' , bookSchema)