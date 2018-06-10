const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const OrderBook = require('../models/OrderBook')
const PORT = process.env.PORT || 8000;
const Book = require('../models/Book')

router.get('/', (req, res) => {
    OrderBook
        .find()
        .select('book student teacher date_from date_final')
        .populate()
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    return {
                        id : doc.id,
                        book : doc.book,
                        student : doc.student,
                        teacher : doc.teacher,
                        date_from : doc.date_from,
                        date_final : doc.date_final,
                        request:{
                            type : "GET",
                            url : `localhost:${PORT}/orderBooks/${doc.id}`
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
    console.log("POST OrderBook")
    Book.findById(req.body.book)
        .then((book)=>{
            if(!book){
                return res.status(404).json({
                    sucess : false,
                    message: "This book doesn't exist",
                })
            }
            const orderBook = new OrderBook({
                _id: new mongoose.Types.ObjectId(),
                book : req.body.book,
                student : req.body.student,
                teacher : req.body.teacher,
                date_from : req.body.date_from,
                date_final : req.body.date_final,
            })
            return orderBook.save()
        }).then(()=>{
            console.log(result)
            res.status(200).json({
                message: "Created Order book succesfully",
                sucess : true,
                createdOrderBook : {
                    id : result.id,
                    book : result.book,
                    student : result.student,
                    teacher : result.teacher,
                    date_from : result.date_from,
                    date_final : result.date_final,
                }
            })
        }).catch((error)=>{
            res.status(500).json({
                error : error
            })
        })
})



router.get('/:id', (req, res) => {
    const orderBookId = req.params.id
    OrderBook.findById(orderBookId)
        .populate()
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    sucess : true,
                    data : {
                        id : result.id,
                        book : result.book,
                        student : result.student,
                        teacher : result.teacher,
                        date_from : result.date_from,
                        date_final : result.date_final,
                    },
                    request : {
                        type : "GET",
                        url : `http://localhost:${PORT}/orderBooks/`
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
    const orderBookId = req.params.id
    OrderBook.remove({
            _id: orderBookId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "ORDERS has deleted succesfully",
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