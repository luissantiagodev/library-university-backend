const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const OrderProyector = require('../models/orderProyector.js')
const PORT = process.env.PORT || 8000;
const Proyector = require('../models/Proyector.js')

router.get('/', (req, res) => {
    OrderProyector
        .find()
        .select('proyector teacher date schedule place')
        .populate()
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    return {
                        id : doc.id,
                        proyector : doc.proyector,
                        teacher : doc.teacher,
                        date : doc.date,
                        schedule : doc.schedule,
                        place : doc.place,
                        request:{
                            type : "GET",
                            url : `localhost:${PORT}/orderProyectors/${doc.id}`
                        }
                    }
                }),
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
    console.log("POST OrderProyector")
    Book.findById(req.body.proyector)
        .then((proyector)=>{
            if(!proyector){
                return res.status(404).json({
                    sucess : false,
                    message: "This Proyector doesn't exist",
                })
            }
            const orderProyector = new OrderProyector({
                _id: new mongoose.Types.ObjectId(),
                proyector : req.body.proyector,
                teacher : req.body.teacher,
                date : req.body.date,
                schedule : req.body.schedule,
                place : req.body.place,
            })
            return orderProyector.save()
        }).then(()=>{
            console.log(result)
            res.status(200).json({
                message: "Created Order proyectors succesfully",
                sucess : true,
                createdOrderProyector : {
                    id : result.id,
                    proyector : result.proyector,
                    teacher : result.teacher,
                    date : result.date,
                    schedule : result.schedule,
                    place : result.place,
                }
            })
        }).catch((error)=>{
            res.status(500).json({
                error : error
            })
        })
})


router.get('/:id', (req, res) => {
    const orderProyector = req.params.id
    OrderProyector.findById(orderProyector)
        .populate()
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    sucess : true,
                    data : {
                        id : result.id,
                        proyector : result.proyector,
                        teacher : result.teacher,
                        date : result.date,
                        schedule : result.schedule,
                        place : result.place,
                    },
                    request : {
                        type : "GET",
                        url : `http://localhost:${PORT}/orderProyectors/`
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
            console.log('------------------------------------');
            console.log(err);
            console.log('------------------------------------');
            res.status(500).json({
                error: err
            })
        })
})


router.delete('/:id', (req, res) => {
    const orderProyector = req.params.id
    OrderProyector.remove({
            _id: orderProyector
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "ORDERS Proyectors has deleted succesfully",
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