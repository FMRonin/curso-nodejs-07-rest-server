const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let enumRoles = {
    values:['USER_ROLE','ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
        type: String,
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: enumRoles
    },
    state:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

userSchema.plugin(uniqueValidator,{message: 'Error de validación, el usuario {VALUE} ya existe'});

module.exports =mongoose.model('user', userSchema)