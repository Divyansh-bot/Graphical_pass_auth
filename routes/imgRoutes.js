const express = require("express");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

// ✅ Serve Static Images Properly
router.use("/images", express.static(path.join(__dirname, "../public/images")));

// ✅ Fetch Images Based on Category (Used in Registration & Login)
router.get("/get-images", async (req, res) => {
    const category = req.query.category;

    if (!category) {
        console.error("❌ Missing category in request.");
        return res.status(400).json({ message: "Category is required" });
    }

    console.log(`ℹ️ Fetching images for category: ${category}`);

    const imageDir = path.join(__dirname, "../public/images", category);

    if (!fs.existsSync(imageDir)) {
        console.error("❌ Image directory not found:", imageDir);
        return res.status(404).json({ message: "Category not found" });
    }

    fs.readdir(imageDir, (err, files) => {
        if (err) {
            console.error("❌ Error reading directory:", err);
            return res.status(500).json({ message: "Error fetching images" });
        }

        const images = files
            .filter(file => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"))
            .map(file => `/images/${category}/${file}`);

        if (images.length === 0) {
            console.warn("⚠️ No images found for category:", category);
            return res.status(404).json({ message: "No images found" });
        }

        console.log(`✅ Images Retrieved: ${images.length}`);
        res.json({ images });
    });
});

// ✅ Fetch Images for User's Registered Category (Used in Image Authentication)
router.get("/get-user-images", async (req, res) => {
    if (!req.session || !req.session.user) {
        console.error("❌ No active session found.");
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const userEmail = req.session.user.email;
    console.log(`ℹ️ Fetching images for user: ${userEmail}`);

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            console.error("❌ User not found in database.");
            return res.status(404).json({ message: "User not found" });
        }

        const category = user.imageCategory;
        console.log(`ℹ️ User's registered category: ${category}`);

        const imageDir = path.join(__dirname, "../public/images", category);

        if (!fs.existsSync(imageDir)) {
            console.error("❌ Image directory not found:", imageDir);
            return res.status(404).json({ message: "Category not found" });
        }

        fs.readdir(imageDir, (err, files) => {
            if (err) {
                console.error("❌ Error reading directory:", err);
                return res.status(500).json({ message: "Error fetching images" });
            }

            const images = files
                .filter(file => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"))
                .map(file => `/images/${category}/${file}`);

            if (images.length === 0) {
                console.warn("⚠️ No images found for user's category:", category);
                return res.status(404).json({ message: "No images found" });
            }

            console.log(`✅ User Images Retrieved: ${images.length}`);
            res.json({ images });
        });

    } catch (error) {
        console.error("❌ Error fetching user images:", error);
        res.status(500).json({ message: "Server error. Try again." });
    }
});



// ✅ Fetch Fake Authentication Images (Random Mix)
router.get("/fake-auth-images", (req, res) => {
    console.log("ℹ️ Fetching fake authentication images...");

    const categories = ["animals", "chocolates", "companies"]; // Adjust categories
    let allImages = [];

    categories.forEach(category => {
        const imageDir = path.join(__dirname, "../public/images", category);
        if (fs.existsSync(imageDir)) {
            const files = fs.readdirSync(imageDir)
                .filter(file => file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png"))
                .map(file => `/images/${category}/${file}`);
            allImages = allImages.concat(files);
        }
    });

    if (allImages.length === 0) {
        console.error("❌ No images found for fake authentication.");
        return res.status(404).json({ message: "No images available" });
    }

    // ✅ Randomly Pick 9 Images for Fake Grid
    const shuffledImages = allImages.sort(() => 0.5 - Math.random()).slice(0, 9);
    console.log(`✅ Fake Authentication Images Sent: ${shuffledImages.length}`);
    
    res.json({ images: shuffledImages });
});

module.exports = router;
