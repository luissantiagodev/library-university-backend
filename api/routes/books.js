const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Book = require('../models/Book')
const PORT = process.env.PORT || 8000;

router.get('/', (req, res) => {
    Book
        .find()
        .select('publisher title num_of_edicion ISBN author estante facePosition level quantity')
        .populate('estante')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    return {
                        id : doc.id,
                        publisher : doc.publisher,
                        title : doc.title,
                        num_of_edicion : doc.num_of_edicion,
                        ISBN : doc.ISBN,
                        author : doc.author,
                        estante : doc.estante,
                        facePosition : doc.facePosition,
                        level : doc.level,
                        quantity : doc.quantity
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
    const bookId = req.params.id
    Book.findById(bookId)
        .select('publisher title num_of_edicion ISBN author estante facePosition level quantity')
        .exec()
        .populate('estante')
        .then(docs => {
            if (docs) {
                console.log(docs)
                const response = {
                    count : docs.length,
                    sucess : true,
                    data : {
                        id : docs.id,
                        publisher : docs.publisher,
                        title : docs.title,
                        num_of_edicion : docs.num_of_edicion,
                        ISBN : docs.ISBN,
                        author : docs.author,
                        estante : docs.estante,
                        facePosition : docs.facePosition,
                        level : docs.level,
                        quantity : docs.quantity
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
    console.log("POST a BOOK")
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        publisher : req.body.publisher,
        title : req.body.title,
        num_of_edicion : req.body.num_of_edicion,
        ISBN : req.body.ISBN,
        author : req.body.author,
        estante : req.body.estante,
        facePosition : req.body.facePosition,
        level : req.body.level,
        quantity : req.body.quantity
    })

    book.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: "Created Book succesfully",
            sucess : true,
            createdBook : {
                id : result.id,
                name: result.name,
                publisher : result.publisher,
                title : result.title,
                num_of_edicion : result.num_of_edicion,
                ISBN : result.ISBN,
                author : result.author,
                estante : result.estante,
                facePosition : result.facePosition,
                level : result.level,
                quantity : result.quantity
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
    const bookId = req.params.id
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Book.update({
            _id: bookId
        }, {
            $set: updateOps
        })
        .exec()
        .then(docs=>{
            let response = {
                message : "Book updated succesfully",
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
    const bookId = req.params.id
    Book.remove({
            _id: bookId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "Book has deleted succesfully",
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