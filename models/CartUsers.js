const mongoose = require("mongoose")
const Joi = require("joi")

const CartUserSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Books"
            },

            items: {
                type: Number,
                minlength: 1
            }

        }
    ]

})

const CartUser = mongoose.model("CartUser", CartUserSchema)

const vaildateDataCart = (obj) => {
    const schema = Joi.object({
        productId: Joi.string().trim().hex().length(24).required(),
        items: Joi.number().min(1).required()
    })

    return schema.validate(obj)

}

const vaildateUpdateDataCart = (obj) => {
    const schema = Joi.object({
        items: Joi.number().min(1)
    })

    return schema.validate(obj)

}

module.exports = {
    CartUser,
    vaildateDataCart,vaildateUpdateDataCart
}