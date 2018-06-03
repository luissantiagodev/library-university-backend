const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000;
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Student = require('./models/Student')
const studentRoutes = require('./api/routes/students')
const bodyParser = require('body-parser')
const teacherRoutes = require('./api/routes/teachers')

//Express setup
app.listen(PORT, () => console.log(`Server listeing in ${PORT}`))
app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json)
app.use('/students' , studentRoutes)
app.use('/teachers' , teacherRoutes)
app.use((req , res , next)=>{
  const error = new Error('Not found')
  error.status = 404
  next(error)
})
app.use((error , req ,  res , next)=>{
  res.status(error.status || 500)
  res.json({
    error : {
      message : error.message
    }
  })
})

//DB setup
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>console.log("Connected"));

app.get('/', (req, res) => {
  let student = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: "Luis Santiago",
    matricula: "SARL"
  })
  res.send(student)
})