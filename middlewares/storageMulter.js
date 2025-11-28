const multer = require("multer")
const fs = require("fs")
const path = require("path")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,path.join(__dirname,'../tmp/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix+ "-"+ file.originalname.replaceAll(" ", ""))
  }
})

const upload = multer({ storage })

module.exports = upload