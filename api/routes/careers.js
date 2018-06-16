const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Career = require('../models/Career')
const PORT = process.env.PORT || 8000;

router.get('/', (req, res) => {
    Career
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



router.get('/:id', (req, res) => {
    const careerId = req.params.id
    Career.findById(careerId)
        .select('name')
        .exec()
        .then(docs => {
            if (docs) {
                console.log(docs)
                const response = {
                    count : docs.length,
                    sucess : true,
                    data : {
                            id : docs.id,
                            name : docs.name,
                    }
                }
                res.status(200).json(response)
            } else {
                res.status(404).json({
                    message: "No valid entry found provided ID"
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res) => {
    console.log("POST career")
    const career = new Career({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
    })
    career.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: "Created Carrer succesfully",
            sucess : true,
            createdCareer : {
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
    const careerId = req.params.id
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Career.update({
            _id: careerId
        }, {
            $set: updateOps
        })
        .exec()
        .then(docs=>{
            let response = {
                message : "Career updated succesfully",
                sucess : true,
                request : {
                    type : "GET",
                    url : `http://localhost:${PORT}/careers`
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
    const careerId = req.params.id
    Career.remove({
            _id: studentId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "Career has deleted succesfully",
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