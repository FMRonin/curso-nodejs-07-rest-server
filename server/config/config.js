/* 
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000

/* 
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/* 
 * Entorno
 */
let urlDB

 if (process.env.NODE_ENV=='dev') {
     urlDB = 'mongodb://localhost:27017/node-restserver'
} else {
    urlDB = 'mongodb+srv://fmronin:xryR0P9a2kjF6WeZ@cluster0.z1a7g.mongodb.net/node-restserver'
}

process.env.DB_URL = urlDB