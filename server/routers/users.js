const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const _ = require('underscore')
const { validateToken,validateRole } = require('../middlewares/authentication')

const User = require('../models/user');

app.get('/users/:id', validateToken, (req,res) => {
    res.json(`get Users ${req.params.id}`)
})

app.get('/users', validateToken, (req,res) => {

    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5

    let usuarioActivoFiltro = {state:true}

    User.find(usuarioActivoFiltro,'name email role state google')
        .skip(desde)
        .limit(limite)
        .exec((err,users) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err:err.message
                })
            }

            User.countDocuments(usuarioActivoFiltro, (err,count) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err:err.message
                    })
                }

                res.json({
                    ok:true,
                    usuarios:users,
                    total:count
                })
            })
        })
})

app.post('/users',[validateToken,validateRole], (req,res) => {
    let reqBody = req.body

    let usuario = new User({
        name: reqBody.name,
        email: reqBody.email,
        password: bcrypt.hashSync(reqBody.password, 10 ),
        role: reqBody.role
    })

    usuario.save((err,usuarioDB) => { 
        if (err) {
            return res.status(400).json({
                ok: false,
                err:err.message
            })
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
})

app.put('/users/:id',[validateToken,validateRole], (req,res) => {

    let id = req.params.id
    let body = _.pick(req.body,['name','email','img','role']) //limitar parametros a actualizar
    //let body =req.body

    User.findByIdAndUpdate(id,body,{new:true, runValidators:true, context: 'query' },(err,usuarioDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err:err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err:'No existe usuario con ese ID'
            })
        }

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    })
})

app.delete('/users/:id', [validateToken,validateRole] , (req,res) => {
    let id = req.params.id
    
    cambiarEstado = {state:false}

    //User.findByIdAndDelete(id,(err,deletedUser) => {
    User.findByIdAndUpdate(id,cambiarEstado,{new:true},(err,deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err:err
            })
        }

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err:'Usuario no existe'
            })
        }

        res.json({
            ok:true,
            deletedUser
        })
    })
})

module.exports=app 