const express = require('express');
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
const { CartUser, vaildateDataCart, vaildateUpdateDataCart } = require("../models/CartUsers")
const { Books } = require("../models/Books")
var jwt = require('jsonwebtoken');
const { vaildateObjectIdCart, vaildateObjectIdBook } = require("../middlewares/valideteObjectId")
const router = express.Router()
const authenticateToken = require("../middlewares/authentication ")
/*

    Creat/Post New Product

*/
router.post("/new-cart", vaildateObjectIdBook, asyncHandler(async (req, res) => {
    const { productId, items } = req.body;

    const { error } = vaildateDataCart(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const n = new CartUser({

        products: [
            { product: productId, items: items }
        ]

    })
    const result = await n.save()
    const token = jwt.sign({ id: result._id, role: "user" }, process.env.SECRET)
    res.json({ YourCart: await result.populate("products.product"), token })
}))

router.get("/carts/", authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({message: 'Unauthorized: You are not an administrator.'});

    }
    const result = await CartUser.find().populate("products.product")

    res.json({ "carts": result })
}))



router.get("/carts/my-cart", authenticateToken, asyncHandler(async (req, res) => {
    const {id} = req.user
    const result = await CartUser.findById(id).populate("products.product")

    res.json({ "cart": result })
}))


router.post("/carts/my-cart/new",authenticateToken, vaildateObjectIdBook, asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { error } = vaildateDataCart(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { productId, items } = req.body;
    const update = await CartUser.findByIdAndUpdate(id, {
        $push: {
            products: {
                product: productId, items: items

            }

        }
    }, { new: true }).populate("products.product")


    res.json(update)
}))



// Set The items 

router.put("/carts/my-cart/:productId",authenticateToken,vaildateObjectIdCart, asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const {id} = req.user;
    const { error } = vaildateUpdateDataCart(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { items } = req.body;

    const update = await CartUser.findOneAndUpdate({ "_id": id, "products._id": productId }, {
        $set: {
            "products.$.items": items
        }
    }, { new: true }).populate("products.product")

    if(!update){
        return res.status(404).json({messgae: "Product is not found"})
    }
    res.json(update)
}))

router.delete("/carts/my-cart/:productId",authenticateToken, vaildateObjectIdCart, asyncHandler(async (req, res) => {

    const { productId } = req.params;
    const { id } = req.user;
    const product = await CartUser.find({"_id": id, "products._id": productId})
    if(product.length ==0){
        return res.status(404).json({messgae: "Product is not found"})
    }

    const deleteProduct = await CartUser.findByIdAndUpdate(id, {
        $pull: {
            products: {
                "_id": productId
            }
        }
    }, { new: true }).populate("products.product")
    
    res.json({ message: "Product has been deleted.", data: deleteProduct })
}))

module.exports = router