const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Student = require('../models/Student')
const PORT = process.env.PORT || 8000;
const bycript = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    Student
        .find()
        .select('name matricula phoneNumber password career')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                sucess : true,
                data : docs.map(doc=>{
                    console.log(doc.career)
                    return {
                        id : doc.id,
                        name : doc.name,
                        matricula : doc.matricula,
                        phoneNumber : doc.phoneNumber,
                        password : doc.password,
                        career : doc.career,
                        request : {
                            type : "GET",
                            url : `http://localhost:${PORT}/students/${doc.id}`
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
    console.log("POST STUDENTS")
    Student.find({matricula : req.body.matricula})
        .exec()
        .then(user=>{
            if(user.length >= 1){
                return res.status(409).json({
                    sucess : false,
                    message : "MATRICULA ALREADY EXIST"
                })
            }else{
                const student = new Student({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    matricula: req.body.matricula,
                    phoneNumber: req.body.phoneNumber,
                    career : req.body.career,
                }) 
                student.save().then(result => {
                    console.log(result)
                    res.status(200).json({
                        message: "Created student succesfully",
                        sucess : true,
                        createdStudent : {
                            id : result.id,
                            name : result.name,
                            matricula : result.matricula,
                            phoneNumber : result.phoneNumber,
                            career : result.career,
                            request : {
                                type : "GET",
                                url : `http://localhost:${PORT}/students/${result.id}`
                            }
                        }
                    })
                }).catch(error => {
                    console.log(error)
                    res.status(500).json({
                        error: error,
                        sucess : false
                    })
                })
            }
        })
})

router.get('/:id', (req, res) => {
    const studentId = req.params.id
    Student.findById(studentId)
        .select('name matricula phoneNumber password career')
        .exec()
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
                        url : `http://localhost:${PORT}/students/`
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
    const studentId = req.params.id
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Student.update({
            _id: studentId
        }, {
            $set: updateOps
        })
        .exec()
        .then(docs=>{
            let response = {
                message : "Student updated succesfully",
                sucess : true,
                request : {
                    type : "GET",
                    url : `http://localhost:${PORT}/students/${docs.id}`
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
    const studentId = req.params.id
    Student.remove({
            _id: studentId
        })
        .exec()
        .then(docs => {
            console.log(docs)
            res.status(200).json({
                message: "Student has deleted succesfully",
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


router.post('/signup' , (req , res)=>{
    Student.find({matricula : req.body.matricula})
    .exec()
    .then(users=>{
        if(users.length < 1){
            res.status(401).json({
                error: "Authed failed"
            })
        }

        bycript.compare(req.body.password , users[0].password , (error , result)=>{
            if(error){
                res.status(401).json({
                    error: "Authed failed"
                })
            }

            if(result){
                const token = jwt.sign({
                   matricula : users[0].matricula,
                   userId : users[0]._id
                },"secret" , {
                    expiresIn : "1h"
                })
                res.status(200).json({
                    error: "Authed sucesfull",
                    token : token
                })
            }

            res.status(401).json({
                error: "Authed failed"
            })
        })
    })
})


module.exports = router