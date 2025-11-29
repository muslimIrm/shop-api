
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
const { CartUser } = require("../models/CartUsers")
const { Books } = require("../models/Books")

const vaildateObjectIdCart = asyncHandler(async (req, res, next) => {

    const { id } = req.user;
    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid book ID format" });
    }

    const CartUserCheck = await CartUser.findById(id);
    if (!CartUserCheck) {
        return res.status(404).json({ message: "User not found" });
    }
    

    next()
})


const vaildateObjectIdBook = asyncHandler(async (req, res, next) => {

    const { productId } = req.body;
    console.log(productId)
    if (!productId) {
        return res.status(400).json({ message: "Book ID is required" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid book ID format" });
    }

    const productCheck = await Books.findById(productId);
    if (!productCheck) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    next();

})
module.exports = { vaildateObjectIdCart, vaildateObjectIdBook }
