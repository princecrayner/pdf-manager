const express = require("express");

const router = express.Router();

const Content = require("../models/Content");


// =========================
// HOMEPAGE
// =========================

router.get("/", async (req, res) => {

    try {

        // =========================
        // LATEST
        // Newest 10 uploads
        // =========================

        const latest = await Content
            .find()
            .sort({
                createdAt: -1
            })
            .limit(10);


        // =========================
        // POPULAR
        // Highest viewed 10
        // =========================

        const popular = await Content
            .find()
            .sort({
                views: -1,
                createdAt: -1
            })
            .limit(10);


        // =========================
        // TRENDING
        // Temporary trending system
        // =========================

        const trending = await Content
            .find()
            .sort({
                views: -1,
                createdAt: -1
            })
            .limit(10);


        // =========================
        // SUGGESTED
        // Random 10 items
        // =========================

        const suggested = await Content.aggregate([

            {
                $sample: {
                    size: 10
                }
            }

        ]);


        // =========================
        // RENDER HOMEPAGE
        // =========================

        res.render("home", {

            trending: trending,

            suggested: suggested,

            latest: latest,

            popular: popular

        });


    } catch (error) {

        console.error(
            "Homepage error:",
            error
        );


        res.status(500).send(
            "Something went wrong loading the homepage."
        );

    }

});


module.exports = router;