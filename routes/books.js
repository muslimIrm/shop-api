const express = require('express');
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose');
const { Books, validateCeartBooks, validateUpdateBooks } = require("../models/Books")
const router = express.Router()
const authenticateToken = require("../middlewares/authentication ")
const multer = require("multer")
const upload = require("../middlewares/storageMulter")
var jwt = require('jsonwebtoken');

/*

    Creat/Post New Product

*/
router.post("/books/new", upload.single("image"), authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: 'Unauthorized: You are not an administrator.' });
    }
    const file = req.file
    const { error } = validateCeartBooks(req.body)
    if (error || !file) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { title, description, price, author, pages } = req.body
    const image = `${req.host}/upload/images/${file.filename}`
    const book = new Books({
        title: title,
        description: description,
        price: price,
        pages: pages,
        author: author,
        image
    })

    const result = await book.save()

    res.json(result)
}))

/*

    Get All Products

*/

router.get("/books/", asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) <= 1 ? parseInt(req.query.page) : 1 || 1;


    const offset = (page - 1) * limit
    const result = await Books.find().skip(offset).limit(limit)
    const totalProducts = await Books.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit)
    res.json({
        "Books": result, totalPages,
        totalProducts,
    })
}))

/*

    Get Product

*/

router.get("/books/search", asyncHandler(async (req, res) => {

    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) <= 1 ? parseInt(req.query.page) : 1 || 1;
    const title = req.query.title? req.query.title.trim() : false
    const offset = (page - 1) * limit
    if (!title) {
        return res.status(400).json({
            message: "Please provide a book title to search for.",
            error: "MISSING_TITLE"
        });
    }
    const result = await Books.find({title: {$regex: title, $options: "i"}}).skip(offset).limit(limit)
    res.status(200).json(result)
}))

/*

    Get Product

*/

router.get("/books/:productId",validateUpdateBooks, asyncHandler(async (req, res) => {
    const { productId } = req.params

    const book = await Books.findById(productId)

    if (book) {

        res.status(200).json(book)
    } else {
        res.status(404).json({ message: "Book not found." })
    }

}))


/*

    Update Book

*/
router.put("/books/:productId",validateCeartBooks, authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: 'Unauthorized: You are not an administrator.' });
    }
    const { error } = validateUpdateBooks(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const { title, description, price, author, pages } = req.body
    const { productId } = req.params

    const data = {
        title: title,
        description: description,
        price: price,
        pages: pages,
        author: author
    }

    const book = await Books.findById(productId)

    if (book) {
        const booksUpdated = await Books.findByIdAndUpdate(productId, { $set: data }, { new: true })

        res.status(200).json(booksUpdated)
    } else {
        res.status(404).json({ message: "Book not found." })
    }

    res.json(book)
}))

/*

    Delete Product

*/

router.delete("/books/:id", authenticateToken, asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: 'Unauthorized: You are not an administrator.' });
    }
    const { id } = req.params

    const book = await Books.findById(id)

    if (book) {
        await Books.findByIdAndDelete(id)
        res.status(200).json({ message: "book has been deleted successfully" })
    } else {
        res.status(404).json({ message: "Book not found." })
    }

}))


module.exports = router