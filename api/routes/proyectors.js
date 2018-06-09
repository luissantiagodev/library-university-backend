const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Proyector = require('../models/Proyector')
const PORT = process.env.PORT || 8000;

router.get('/', (req, res) => {
    Proyector
        .find()
        .select('name')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    return {
                        id : doc.id,
                        name : doc.name,
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
    console.log("POST PROYECTOR")
    const career = new Proyector({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
    })

    career.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: "Created PROYECTOR succesfully",
            sucess : true,
            createdProyector : {
                id : result.id,
                name : result.name,
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
    const ProyectorId = req.params.id
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Proyector.update({
            _id: ProyectorId
        }, {
            $set: updateOps
        })
        .exec()
        .then(docs=>{
            let response = {
                message : "PROYECTOR updated succesfully",
                sucess : true,
                request : {
                    type : "GET",
                    url : `http://localhost:${PORT}/proyectors`
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
    const proyectorId = req.params.id
    Proyector.remove({
            _id: studentId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "Proyector has deleted succesfully",
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