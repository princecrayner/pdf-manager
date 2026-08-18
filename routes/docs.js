const express = require("express");
const router = express.Router();

const Document = require("../models/Document");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");


router.post(
    "/upload",
    upload.single("pdf"),
    async (req, res) => {

        try {

            const newDoc = new Document({

                name: req.body.name,

                pdfUrl: req.file.path,

                cloudinaryId: req.file.filename

            });

            await newDoc.save();

            res.status(201).json({
                message: "PDF uploaded successfully",
                document: newDoc
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    }
);



router.get("/", async (req, res) => {

    try {

        const docs = await Document.find().sort({

            uploadedAt: -1

        });

        res.json(docs);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


module.exports = router;