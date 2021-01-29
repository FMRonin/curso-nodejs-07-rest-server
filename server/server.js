require('./config/config')

const mongoose = require('mongoose')

const express = require('express')
const app = express()

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(require('./routers/users'))

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
    }).then(()=>console.log('conectado')).catch((err) => console.log(err))

app.listen(process.env.PORT,() => console.log(`Ecuchando por puerto ${process.env.PORT}`))