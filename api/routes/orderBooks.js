const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const OrderBook = require('../models/OrderBook')
const PORT = process.env.PORT || 8000;
const Book = require('../models/Book')
const moment = require('moment')
const pdfMakePrinter = require('pdfmake')
const path = require('path')
const fs = require('fs')

router.get('/', (req, res) => {
    OrderBook
        .find()
        .select('book student teacher date_from date_final status')
        .populate('book student teacher')
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
                        status : doc.status,
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


router.get('/reporte/:start/:end' , (req , res)=>{
    let startDateReq = req.params.start
    let endDateReq = req.params.end
    OrderBook
        .find()
        .select('book student teacher date_from date_final status')
        .populate('book student teacher')
        .exec()
        .then(docs => {
            let originalArray = docs.map(doc=>{
                console.log('------------------------------------');
                console.log(moment(doc.date_from).format('L'));
                console.log('------------------------------------');
                if(doc.teacher === null){
                    return{
                        id : doc.id,
                        Libro : doc.book.title,
                        Nombre : doc.student.name,
                        Fecha_Inicio : moment(doc.date_from).format('L'),
                        Fecha_Entrega : moment(doc.date_final).format('L'),
                        tipo : "ESTUDIANTE",
                        status : doc.status,
                    }
                }else{
                    return {
                        id : doc.id,
                        Libro : doc.book.title,
                        Nombre : doc.teacher.name,
                        Fecha_Inicio : moment(doc.date_from).format('L'),
                        Fecha_Entrega : moment(doc.date_final).format('L'),
                        tipo : "Profesor",
                        status : doc.status,
                    }
                } 
            })

            let newArray = originalArray.filter(x=>{
                var compareDate = moment(x.date_from);
                var startDate   = moment(startDateReq);
                var endDate     = moment(endDateReq);
                if(compareDate.isBetween(startDate, endDate)){
                    return true;
                }else{
                    return false;
                }
            })
            console.log("PASSING DATA")
            console.log(newArray)
            var dd = {
                content: [
                    table(newArray, ['Libro', 'Nombre' , "status" , "Fecha_Inicio" , "Fecha_Entrega" , "tipo"])
                ],
                header:  {
                    margin: 10,
                    columns: [
                        {
                            margin: [10, 10, 0, 0],
                            text: 'Reporte'
                        }
                    ]
                },
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true
                    },
                      keepmargin: {
                alignment: 'center',
                margin: [0,300,0,0]
            },
                }
            }
            createPdfBinary(dd, res)
            //res.status(200).json(newArray)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

function buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
        console.log(row)
        var dataRow = [];
        columns.forEach(function (column) {
            //console.log(column)
            dataRow.push(row[column].toString());
        })

        body.push(dataRow);
    });

    return body;
}

function table(data, columns) {
    return {
        table: {
            layout: 'lightHorizontalLines', // optional
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto','auto', '*'],
            margin: [0 , 700 , 0 ,0],
            body: buildTableBody(data, columns)
        }
    };
}


function createPdfBinary(pdfDoc, res) {
    var temp123;

    const fontDescriptors = {
        Roboto: {
            normal: path.join(__dirname + '/Roboto/Roboto-Regular.ttf'),
            italics: path.join(__dirname + '/Roboto/Roboto-Italic.ttf'),
            bold: path.join(__dirname + '/Roboto/Roboto-Medium.ttf'),
            bolditalics: path.join(__dirname + '/Roboto/Roboto-MediumItalic.ttf')
        }
    };

    var printer = new pdfMakePrinter(fontDescriptors);
    var doc = printer.createPdfKitDocument(pdfDoc);
    var chunks = [];
    var result;

    doc.on('data', (chunk) => {
        chunks.push(chunk);
    });


    doc.pipe(temp123 = fs.createWriteStream(__dirname + "/example.pdf"), {
        encoding: 'utf16'
    });


    temp123.on('finish', async function () {
        // do send PDF file 
        res.status(200).json({
            nameOfFile : "/example.pdf"
        })
    });

    doc.end();
}


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
        }).then((result)=>{
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
                    status : result.status
                }
            })
        }).catch((error)=>{
            res.status(500).json({
                error : error
            })

            console.log(error)
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