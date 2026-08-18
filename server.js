require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const docsRoutes = require("./routes/docs");
const homeRoutes = require("./routes/home");
const contentRoutes = require("./routes/content");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API ROUTES FIRST
app.use("/api/docs", docsRoutes);
app.use("/api/content", contentRoutes);

// WEBSITE ROUTES
app.use("/", homeRoutes);

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// =========================
// HOMEPAGE
// =========================

app.get("/", async (req, res) => {

    try {

        const Content = require("./models/Content");


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
        // Recently uploaded + views
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
        // Random selection
        // =========================

        const suggested = await Content.aggregate([
            {
                $sample: {
                    size: 10
                }
            }
        ]);


        // =========================
        // HOMEPAGE
        // =========================

        res.render("home", {

            trending,

            suggested,

            latest,

            popular

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

// =========================
// CATEGORY PAGES
// =========================

app.get("/games", (req, res) => {
    res.redirect("/category/Games");
});

app.get("/videos", (req, res) => {
    res.redirect("/category/Videos");
});

app.get("/movies", (req, res) => {
    res.redirect("/category/Movies");
});

app.get("/music", (req, res) => {
    res.redirect("/category/Music");
});

app.get("/apps", (req, res) => {
    res.redirect("/category/Apps");
});

app.get("/pictures", (req, res) => {
    res.redirect("/category/Pictures");
});

app.get("/news", (req, res) => {
    res.redirect("/category/News");
});

app.get("/technology", (req, res) => {
    res.redirect("/category/Technology");
});

app.get("/entertainment", (req, res) => {
    res.redirect("/category/Entertainment");
});

app.get("/trending", (req, res) => {
    res.redirect("/category/Trending");
});


// =========================
// CATEGORY DISPLAY
// =========================

app.get("/category/:category", async (req, res) => {

    try {

        const Content = require("./models/Content");

        const category = req.params.category;

        const content = await Content.find({

            category: {
                $regex: "^" + category + "$",
                $options: "i"
            }

        }).sort({
            createdAt: -1
        });


        res.render("category", {

            category: category,

            content: content

        });

    } catch (error) {

        console.error(
            "Category error:",
            error
        );

        res.status(500).send(
            "Unable to load category."
        );

    }

});

// =========================
// CONTENT DETAIL PAGE
// =========================

app.get("/content/:id", async (req, res) => {

    try {

        const Content = require("./models/Content");


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

            return res.status(404).send(
                "Content not found."
            );

        }


        res.render("content", {

            content: content

        });


    } catch (error) {

        console.error(
            "Content page error:",
            error
        );


        res.status(500).send(
            "Unable to load content."
        );

    }

});

// =========================
// GAMES PAGE
// =========================

app.get("/games", async (req, res) => {

    try {

        const Content = require("./models/Content");

        const games = await Content
            .find({
                category: {
                    $regex: "^Games$",
                    $options: "i"
                }
            })
            .sort({
                createdAt: -1
            });


        res.render("games", {

            games

        });


    } catch (error) {

        console.error(
            "Games page error:",
            error
        );

        res.status(500).send(
            "Unable to load games."
        );

    }

});

app.get("/admin", (req, res) => {

    res.render("admin");

});

app.get("/docs", (req,res)=>{

    res.render("docs");

});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});