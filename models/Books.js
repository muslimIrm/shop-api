const mongoose = require("mongoose")
const Joi = require("joi")

const BooksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        minlength: 15,
        maxlength: 1000,
    },
    price: {
        type: Number,
        required: true,
        maxlength: 4,
    },
    pages: {
        type: Number,
        required: true,
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50

    },
    image: {
        type: String,
        required: true
    }

}, {
    timestamps: true
}
)

const Books = mongoose.model("Books", BooksSchema)

const validateCeartBooks = (object) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(15).max(1000).required(),
        price: Joi.number().min(0).max(1000).required(),
        pages: Joi.number().integer().min(1).max(1400).required(),
        author: Joi.string().min(3).max(50).required(),
    })
    return schema.validate(object)

}

const validateUpdateBooks = (object) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(50).trim(),
        description: Joi.string().min(15).max(1000).trim(),
        price: Joi.number().integer().min(0).max(1000),
        pages: Joi.number().integer().min(1).max(1400),
        author: Joi.string().min(3).max(50).trim()
    })
    return schema.validate(object)

}


module.exports = {
    Books,
    validateCeartBooks,
    validateUpdateBooks
}