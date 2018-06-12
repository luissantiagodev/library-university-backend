const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Estante = require('../models/Estante.js')
const PORT = process.env.PORT || 8000;

router.get('/', (req, res) => {
    Estante
        .find()
        .populate()
        .select('name level career')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    return {
                        id : doc.id,
                        name : doc.name,
                        level : doc.level,
                        career : doc.career,
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res) => {
    console.log("POST a Estante")
    const estante = new Estante({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        level : doc.level,
        career : doc.career
    })

    estante.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: "Created Estante succesfully",
            sucess : true,
            createdEstante : {
                id : result.id,
                name: result.name,
                estante : result.estante
            }
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.patch('/:id', (req, res) => {
    const estanteId = req.params.id
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Book.update({
            _id: estanteId
        }, {
            $set: updateOps
        })
        .exec()
        .then(docs=>{
            let response = {
                message : "Estante updated succesfully",
                sucess : true,
                request : {
                    type : "GET",
                    url : `http://localhost:${PORT}/books`
                }
            }
            res.status(200).json(docs)
        })
        .catch(err=>{
            console.log('------------------------------------');
            console.log(err);
            console.log('------------------------------------');
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:id', (req, res) => {
    const estanteId = req.params.id
    Book.remove({
            _id: estanteId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "Estante has deleted succesfully",
                sucess : true,
                meta_data: docs
            })
        })
        .catch(err => {
            console.log('------------------------------------');
            console.log(err);
            console.log('------------------------------------');
            res.status(500).json({
                error: err
            })
        })
})


module.exports = router