const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Teacher = require('../models/Teacher')
const PORT = process.env.PORT || 8000;

router.get('/', (req, res) => {
    Teacher
        .find()
        .select('name matricula phoneNumber password')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    return {
                        id : doc.id,
                        name : doc.name,
                        matricula : doc.matricula,
                        phoneNumber : doc.phoneNumber,
                        password : doc.password,
                        request : {
                            type : "GET",
                            url : `http://localhost:${PORT}/teachers/${doc.id}`
                        }
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
    console.log("POST TEACHER")
    const teacher = new Teacher({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        matricula: req.body.matricula,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    })
    teacher.save().then(result => {
        console.log(result)
        res.status(200).json({
            message: "Created TEACHER succesfully",
            sucess : true,
            createdTeacher : {
                id : result.id,
                name : result.name,
                matricula : result.matricula,
                phoneNumber : result.phoneNumber,
                password : result.password,
                request : {
                    type : "GET",
                    url : `http://localhost:${PORT}/teachers/${result.id}`
                }
            }
        })
    }).catch(error => {
        console.log(error)
        res.status(500).json({
            error: error
        })
    })
})

router.get('/:id', (req, res) => {
    const teacherId = req.params.id
    Teacher.findById(studentId)
        .exec()
        .select('name matricula phoneNumber password')
        .then(result => {
            if (result) {
                const response = {
                    sucess : true,
                    data : {
                        id : result.id,
                        name : result.name,
                        matricula : result.matricula,
                        phoneNumber : result.phoneNumber,
                        password : result.password,
                    },
                    request : {
                        type : "GET",
                        url : `http://localhost:${PORT}/teachers/`
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


router.patch('/:id', (req, res) => {
    const teacherId = req.params.id
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Teacher.update({
            _id: teacherId
        }, {
            $set: updateOps
        })
        .exec()
        .then(docs=>{
            let response = {
                message : "TEACHER updated succesfully",
                sucess : true,
                request : {
                    type : "GET",
                    url : `http://localhost:${PORT}/teachers/${docs.id}`
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
    const teacherId = req.params.id
    Teacher.remove({
            _id: teacherId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "Teacher has been deleted succesfully",
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