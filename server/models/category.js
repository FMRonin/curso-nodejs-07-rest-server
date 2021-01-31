const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es obligatorio']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'El usario de la categoria es obligatorio']
    }
})

categorySchema.plugin(uniqueValidator,{message: 'Error de validación, la categoria {VALUE} ya existe'});

module.exports =mongoose.model('category', categorySchema)