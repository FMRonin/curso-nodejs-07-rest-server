const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');

const User = require('../models/user');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


app.post('/login', (req,res) => {
    let body = req.body

    User.findOne({email:body.email},(err,userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err:err.message
            })
        }
        
        if (!userDB) {
            return res.status(403).json({
                ok: false,
                err:"Usuario o (contraseña) invalida"
            })
        }else{
            if ( !bcrypt.compareSync(body.password,userDB.password) ) {
                return res.status(403).json({
                    ok: false,
                    err:"(Usuario) o contraseña invalida"
                })
            }
    
            let token = jwt.sign({
                user:userDB,
            }, process.env.SEED, {expiresIn: process.env.EXPIRATION_TOKEN})
    
            res.json({
                ok:true,
                token
            })
        }
    })
})

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    let googleUser = new User()
            googleUser.name = payload.name
            googleUser.email = payload.email
            googleUser.img = payload.picture
            googleUser.google = true
            googleUser.password = ':)'

    return googleUser
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

app.post('/google', async (req,res) => {
    let token = req.body.idtoken
    let googleUser = await verify(token).catch((err => {
        return res.status(403).json({
            ok: false,
            err
        })
    }))
    User.findOne({email:googleUser.email},(err,userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!userDB) {
            googleUser.save((err,userSaved) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                } 

                let token = jwt.sign({
                    user:userSaved,
                }, process.env.SEED, {expiresIn: process.env.EXPIRATION_TOKEN})
                
                return res.json({
                    ok:true,
                    token
                })
            })
        }else{
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err:'Debe autenticarse con google'
                })
            }
            let token = jwt.sign({
                user:userDB,
            }, process.env.SEED, {expiresIn: process.env.EXPIRATION_TOKEN})
    
            return res.json({
                ok:true,
                token
            })
        }
    })
})

module.exports = app