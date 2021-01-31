const express = require('express')
const app = express()
const { validateToken,validateRole } = require('../middlewares/authentication')

const Category = require('../models/category');

app.get('/categories', validateToken, (req,res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 10

    Category.find({})
        .skip(desde)
        .sort('name')
        .limit(limite)
        .populate('user','name email')
        .exec((err,categories) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Category.countDocuments((err,count) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok:true,
                categories,
                total:count
            })
        })
    })
})

app.get('/categories/:id', validateToken, (req,res) => {
    let id = req.params.id
    Category.findById(id,(err,categoryDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            categoryDB
        })
    })
})

app.post('/categories', [validateToken,validateRole], (req,res) => {
    let body = req.body
    let logedUser = req.user
    let category = new Category({
        name:body.name,
        user:logedUser._id
    })
    category.save((err,categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            categoryDB
        })
    })
})

app.put('/categories/:id', [validateToken,validateRole], (req,res) => {
    let body = req.body
    let id = req.params.id
    Category.findByIdAndUpdate(id,{name:body.name},{new:true, runValidators:true, context: 'query' },(err,categoryDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err:'Categoria no existe'
            })
        }
        res.json({
            ok:true,
            categoryDB
        })
    })
})

app.delete('/categories/:id', [validateToken,validateRole], (req,res) => {
    let id = req.params.id
    Category.findByIdAndRemove(id,{new:true},(err,categoryDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err:'Categoria no existe'
            })
        }
        res.json({
            ok:true,
            categoryDB
        })
    })
})

module.exports=app 