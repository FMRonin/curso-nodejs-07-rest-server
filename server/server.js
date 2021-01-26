require('./config/config')

const express = require('express')
const app = express()

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.get('/users/:id', (req,res) => {
    res.json(`get Users ${req.params.id}`)
})
app.post('/users', (req,res) => {
    let reqBody = req.body
    if (reqBody.name === undefined){
        res.status(400).json({code:'10100',message:'Falta un parametro'})
    }else{
        res.json(`post new user con: ${JSON.stringify(reqBody)}`)
    }
})
app.put('/users/:id', (req,res) => {
    let request = JSON.stringify(req.body)
    res.json(`put ${req.params.id} con: ${request}`)
})
app.delete('/users/:id', (req,res) => {
    res.json(`delete user ${req.params.id}`)
})

app.listen(3000,() => console.log('Ecuchando por puerto 3000'))