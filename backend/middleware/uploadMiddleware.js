const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "aureva-products",
    allowedFormats: ["jpg", "png", "webp"],
  },
});

const parser = multer({ storage });

module.exports = parser;