/* 
 * Puerto
 */
process.env.PORT = process.env.PORT || 3000

/* 
 * Entorno
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/* 
 * Fecha de expiración de token
 */
process.env.EXPIRATION_TOKEN = '30 days'

/* 
 * Semilla de firmado de jwt
 * heroku config:set SEED=""  
 */
process.env.SEED = process.env.SEED || 'secret-token-desarrollo'

/* 
 * Entorno
 */
let urlDB

 if (process.env.NODE_ENV=='dev') {
     urlDB = 'mongodb://localhost:27017/node-restserver'
} else {
    urlDB = process.env.MONGO_URI
}

process.env.DB_URL = urlDB