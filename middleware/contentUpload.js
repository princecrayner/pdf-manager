const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const multer = require("multer");


// =========================
// CLOUDINARY CONFIG
// =========================

cloudinary.config({

    cloud_name: process.env.CLOUD_NAME,

    api_key: process.env.API_KEY,

    api_secret: process.env.API_SECRET

});


// =========================
// CLOUDINARY STORAGE
// =========================

const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

        folder: "justSearch/content",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ],

        resource_type: "image"

    }

});


// =========================
// MULTER
// =========================

const contentUpload = multer({

    storage: storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});


module.exports = contentUpload;