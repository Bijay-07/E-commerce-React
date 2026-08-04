const multer = require("multer");

const storage = multer.memoryStorage();

const productUpload = multer({ storage }).single("images");

module.exports = productUpload;