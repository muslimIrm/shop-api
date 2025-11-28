
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
const { CartUser } = require("../models/CartUsers")
const {Books} = require("../models/Books")

const vaildateObjectIdCart = asyncHandler(async (req, res, next) => {

    const { id } = req.user;
    if (mongoose.Types.ObjectId.isValid(id)) {

        const cart = await CartUser.findById(id)
        if (!cart) {

            return res.status(404).json({ message: "User not found" })
        }
    } else {

        return res.json({ message: "Invalid ID" })
    }

    next()
})


const vaildateObjectIdBook = asyncHandler(async (req, res, next) => {

    const { productId } = req.params;
    if (mongoose.Types.ObjectId.isValid(productId)) {

        const productCheck = await Books.findById(productId)
        if (!productCheck) {
            return res.status(404).json({ message: "The product is not found" })
        }
    } else {

        return res.json({ message: "Invalid ID" })
    }



    next()
})
module.exports = { vaildateObjectIdCart, vaildateObjectIdBook }
