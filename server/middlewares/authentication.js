const jwt = require('jsonwebtoken');


/*
 *  Verificar Token
 */

 let validateToken = (req, res, next) => {
    let token = req.get('token')

    jwt.verify(token,process.env.SEED,(err,decoder) =>{
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        req.user = decoder.user
        console.log(req.user)
        next()
    })

    return next
}

/*
 *  Verificar Rol
 */

 let validateRole = (req,res,next) =>{
    let usuario = req.user
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err:'Usuario invalido'
        })
    }
    next();
 }

 module.exports = {
     validateToken,
     validateRole
 }