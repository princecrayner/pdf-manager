const express = require("express");

const router = express.Router();

const Content = require("../models/Content");
const contentUpload = require("../middleware/contentUpload");


// =========================
// ADD CONTENT
// =========================

router.post(
    "/",
    contentUpload.single("image"),
    async (req, res) => {

        try {

            const {
                title,
                description,
                category,
                contentUrl
            } = req.body;


            let imageUrl = "";


            // If an image was uploaded
            if (req.file) {

                imageUrl = req.file.path;

            }


            const newContent = new Content({

                title,

                description,

                category,

                imageUrl,

                contentUrl

            });


            await newContent.save();


            res.status(201).json({

                message: "Content added successfully",

                content: newContent

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message: error.message

            });

        }

    }
);


// =========================
// GET ALL CONTENT
// =========================

router.get("/", async (req, res) => {

    try {

        const content = await Content
            .find()
            .sort({ createdAt: -1 });


        res.json(content);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

});

 
 
// =========================
// DELETE CONTENT
// =========================

router.delete("/:id", async (req, res) => {

    try {

        const content =
            await Content.findByIdAndDelete(
                req.params.id
            );


        if (!content) {

            return res.status(404).json({

                message: "Content not found"

            });

        }


        res.json({

            message: "Content deleted successfully"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to delete content"

        });

    }

});


// =========================
// ADD ONE VIEW
// =========================

router.post("/:id/view", async (req, res) => {

    try {

        const content =
            await Content.findByIdAndUpdate(

                req.params.id,

                {
                    $inc: {
                        views: 1
                    }
                },

                {
                    new: true
                }

            );


        if (!content) {

            return res.status(404).json({

                message: "Content not found"

            });

        }


        res.json({

            message: "View counted",

            views: content.views

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: error.message

        });

    }

});


// =========================
// SEARCH CONTENT
// =========================

router.get("/search", async (req, res) => {

    try {

        const query =
            req.query.q?.trim() || "";


        if (!query) {

            return res.json([]);

        }


        const results =
            await Content.find({

                $or: [

                    {
                        title: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        description: {
                            $regex: query,
                            $options: "i"
                        }
                    },

                    {
                        category: {
                            $regex: query,
                            $options: "i"
                        }
                    }

                ]

            })
            .sort({
                views: -1,
                createdAt: -1
            });


        res.json(results);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Search failed"

        });

    }

});


// =========================
// GET CONTENT BY CATEGORY
// =========================

router.get("/category/:category", async (req, res) => {

    try {

        const category = req.params.category;


        const content = await Content.find({

            category: {
                $regex: "^" + category + "$",
                $options: "i"
            }

        }).sort({

            createdAt: -1

        });


        res.json(content);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to load category"

        });

    }

});


// =========================
// UPDATE CONTENT
// =========================

router.put("/:id", async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            imageUrl,
            contentUrl
        } = req.body;


        const content =
            await Content.findByIdAndUpdate(

                req.params.id,

                {
                    title,
                    description,
                    category,
                    imageUrl,
                    contentUrl
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!content) {

            return res.status(404).json({

                message: "Content not found"

            });

        }


        res.json({

            message: "Content updated successfully",

            content

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;