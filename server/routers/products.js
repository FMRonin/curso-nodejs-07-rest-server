const express = require('express')
const app = express()
const { validateToken,validateRole } = require('../middlewares/authentication')

const Product = require('../models/product');

app.get('/products', validateToken, (req,res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 10

    Product.find({})
        .skip(desde)
        .sort('name')
        .limit(limite)
        .populate('user','name email')
        .populate('category', 'name')
        .exec((err,products) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Product.countDocuments((err,count) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok:true,
                products,
                total:count
            })
        })
    })
})

app.get('/products/search/:parameter', validateToken, (req,res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 10
    let parameter = req.params.parameter

    let regex = new RegExp(parameter,'i')

    Product.find({name:regex})
        .skip(desde)
        .sort('name')
        .limit(limite)
        .populate('user','name email')
        .populate('category', 'name')
        .exec((err,products) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        Product.countDocuments((err,count) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok:true,
                products,
                total:count
            })
        })
    })
})

app.get('/products/:id', validateToken, (req,res) => {
    let id = req.params.id
    Product.findById(id,(err,productDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            productDB
        })
    })
})

app.post('/products', [validateToken,validateRole], (req,res) => {
    let body = req.body
    let logedUser = req.user
    let category = new Product({
        name:body.name,
        unitValue:body.unitValue,
        description:body.description,
        available:body.available,
        category:body.category,
        user:logedUser._id
    })
    category.save((err,productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            productDB
        })
    })
})

app.put('/products/:id', [validateToken,validateRole], (req,res) => {
    let body = req.body
    let id = req.params.id
    let productToUpdate = {
        name:body.name,
        unitValue:body.unitValue,
        description:body.description,
        available:body.available,
        category:body.category
    }
    Product.findByIdAndUpdate(id,productToUpdate,{new:true, runValidators:true, context: 'query' },(err,productDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err:'Producto no existe'
            })
        }
        res.json({
            ok:true,
            productDB
        })
    })
})

app.delete('/products/:id', [validateToken,validateRole], (req,res) => {
    let id = req.params.id
    Product.findByIdAndUpdate(id,{available:false},{new:true},(err,productDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err:'Producto no existe'
            })
        }
        res.json({
            ok:true,
            productDB
        })
    })
})

module.exports=app 