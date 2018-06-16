const mongoose = require('mongoose')

const estanteSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type : String , require : true},
    level : {type : Number , require : true},
    cara : {type : String , require : true},
    career : {type : mongoose.Schema.Types.ObjectId , ref : 'Career'  , require : true},
})

module.exports = mongoose.model('Estante',estanteSchema)