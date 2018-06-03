const express = require('express')
const router = express.Router();


router.get('/' , (req , res)=>{
    res.status(200).send({
        message : "THIS IS THE TEACHERS GET"
    })
})

router.post('/' , (req , res)=>{
    res.status(200).send({
        message : "THIS IS THE TEACHERS POST"
    })
})

router.patch('/' , (req , res)=>{
    res.status(200).send({
        message : "THIS IS THE TEACHERS UPDATE"
    })
})

router.delete('/' , (req , res)=>{
    res.status(200).send({
        message : "THIS IS THE TEACHERS DELETE"
    })
})



module.exports = router