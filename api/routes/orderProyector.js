const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const OrderProyector = require('../models/orderProyector.js')
const PORT = process.env.PORT || 8000;
const Proyector = require('../models/Proyector.js')
const moment = require('moment')
const path = require('path')
const pdfMakePrinter = require('pdfmake')
const fs = require('fs')

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


router.get('/reporte/:start/:end' , (req , res)=>{
    let startDateReq = req.params.start
    let endDateReq = req.params.end
    OrderProyector
        .find()
        .select('proyector teacher date initialHour finalHour place')
        .populate('proyector teacher')
        .exec()
        .then(docs => {
            let originalArray = docs.map(doc=>{
                return{
                    id : doc.id,
                    Proyector : doc.proyector.name,
                    Nombre : doc.teacher.name,
                    Fecha : moment(doc.date).format('L'),
                    Hora_Inicial : moment(doc.initialHour).format('HH:mm:ss'),
                    Hora_Final : moment(doc.finalHour).format('HH:mm:ss'),
                    lugar : doc.place,
                }
            })

            let newArray = originalArray.filter(x=>{
                var compareDate = moment(x.date);
                var startDate   = moment(startDateReq);
                var endDate     = moment(endDateReq);
                if(compareDate.isBetween(startDate, endDate)){
                    return true;
                }else{
                    return false;
                }
            })

            console.log(newArray)
            var dd = {
                content: [
                    table(newArray, ['Proyector', 'Nombre' , "Hora_Inicial" , "Hora_Final" , "Fecha" , "lugar"])
                ],
                header:  {
                    margin: 10,
                    columns: [
                        {
                            margin: [10, 10, 0, 0],
                            text: 'Reporte de proyectores'
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



module.exports = router