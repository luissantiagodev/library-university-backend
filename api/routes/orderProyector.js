const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const OrderProyector = require('../models/orderProyector.js')
const PORT = process.env.PORT || 8000;
const Proyector = require('../models/Proyector.js')

router.get('/', (req, res) => {
    OrderProyector
        .find()
        .select('proyector teacher date initialHour finalHour place')
        .populate('proyector teacher')
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
                        initialHour : doc.initialHour,
                        finalHour : doc.finalHour,
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
    OrderProyector.find({id:req.body.proyector})
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
                date : Date().toString(),
                place : req.body.place,
                initialHour : req.body.initialHour,
                finalHour : req.body.finalHour,
            })
            return orderProyector.save()
        }).then((result)=>{
            console.log(result)
            res.status(200).json({
                message: "Created Order proyectors succesfully",
                sucess : true,
                createdOrderProyector : {
                    id : result.id,
                    proyector : result.proyector,
                    teacher : result.teacher,
                    date : result.date,
                    initialHour : result.initialHour,
                    finalHour : result.finalHour,
                    place : result.place,
                }
            })
        }).catch((error)=>{
            console.log(error)
            console.log("Sengin error")
            res.status(500).json({
                error : error
            })
        })
})


router.get('/:id', (req, res) => {
    const orderProyector = req.params.id
    OrderProyector.findById(orderProyector)
        .select('proyector teacher date initialHour finalHour place')
        .populate('proyector teacher')
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
                        initialHour : result.initialHour,
                        finalHour : result.finalHour,
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