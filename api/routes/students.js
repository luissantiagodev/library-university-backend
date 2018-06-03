const express = require('express')
const router = express.Router();

router.get('/' , (req , res)=>{
    res.status(200).json({
        message : "Handled GET the students route"
    })
})


router.post('/' , (req , res)=>{
    res.status(200).json({
        message : "Handled POST the students route"
    })
})

router.get('/:id' , (req , res)=>{
    const studentId = req.params.id
    if(studentId){
        res.status(200).send({
            message : "GET Recivied a special id",
            id : studentId
        })
    }
})


router.patch('/:id' , (req , res)=>{
    const studentId = req.params.id
    if(studentId){
        res.status(200).send({
            message : "UPDATE STUDENT a special id",
            id : studentId
        })
    }
})

router.delete('/:id' , (req , res)=>{
    const studentId = req.params.id
    if(studentId){
        res.status(200).send({
            message : "DELETE STUDENT a special id",
            id : studentId
        })
    }
})


module.exports = router
