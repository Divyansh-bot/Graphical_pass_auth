const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// 🟢 REGISTER USER
router.post("/register", async (req, res) => {
    try {
        const { name, contact, email, password, imageCategory, imagePattern } = req.body;

        console.log(`📌 Registering user: ${email}`);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn("⚠️ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        // **Store plain password (Only for testing)**
        console.log(`🔍 Storing Plain Password: ${password}`);

        const newUser = new User({
            name,
            contact,
            email,
            password,  // Storing plain password
            imageCategory,
            imagePattern,
        });

        await newUser.save();
        console.log("✅ User registered successfully:", email);

        res.status(201).json({ message: "Registration successful", user: newUser });
    } catch (error) {
        console.error("❌ Registration error:", error);
        res.status(500).json({ message: "Server error. Try again." });
    }
});

// 🟢 LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`📌 Login attempt: ${email}`);

        // 🔍 Find User in Database
        const user = await User.findOne({ email });

        if (!user) {
            console.warn(`⚠️ No user found with email: ${email}`);
            req.session.fakeAuth = true;
            req.session.trueAuth = false;
            return res.status(401).json({ 
                message: "Invalid credentials", 
                redirect: "/fake_img.html" 
            });
        }

        // 🔍 Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`🔍 Stored Hashed Password: ${user.password}`);
        console.log(`🔍 Entered Plain Password: ${password}`);
        console.log(`✅ Password Match Result: ${isMatch}`);

        if (!isMatch) {
            console.warn(`⚠️ Incorrect password for: ${email}`);
            req.session.fakeAuth = true;
            req.session.trueAuth = false;
            return res.status(401).json({ 
                message: "Invalid credentials (Wrong Password)", 
                redirect: "/fake_img.html" 
            });
        }

        // ✅ Store Session Correctly
        req.session.regenerate((err) => {
            if (err) {
                console.error("❌ Session regeneration error:", err);
                return res.status(500).json({ message: "Server error. Try again." });
            }

            req.session.user = {
                id: user._id,
                email: user.email,
                imageCategory: user.imageCategory,
            };

            req.session.trueAuth = true;
            req.session.fakeAuth = false;

            console.log(`✅ Login Successful: ${email}`);
            console.log("🔍 Session Data After Login:", req.session);

            req.session.save((err) => {
                if (err) {
                    console.error("❌ Error saving session:", err);
                    return res.status(500).json({ message: "Server error. Try again." });
                }

                res.status(200).json({ 
                    message: "Login successful", 
                    redirect: "/imgAuth.html", 
                    user: req.session.user 
                });
            });
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "Server error. Try again." });
    }
});


// 🟢 IMAGE AUTHENTICATION
router.post("/verify-images", async (req, res) => {
    try {
        if (!req.session.user) {
            console.warn("⚠️ No user session found.");
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }

        const { email } = req.session.user;
        const { selectedImages } = req.body;

        console.log(`📌 Verifying images for: ${email}`);

        if (!selectedImages || !Array.isArray(selectedImages) || selectedImages.length === 0) {
            console.warn("⚠️ No images received for verification.");
            return res.status(400).json({ message: "Invalid image selection" });
        }

        // Fetch the stored image pattern for the user
        const user = await User.findOne({ email });
        if (!user) {
            console.error("❌ User not found in database.");
            return res.status(400).json({ message: "User not found" });
        }

        const storedPattern = user.imagePattern;

        console.log("🔍 Stored Image Pattern:", storedPattern);
        console.log("🔍 Selected Images:", selectedImages);

        // ✅ Check if selected images match the stored pattern
        const isMatch = JSON.stringify(storedPattern) === JSON.stringify(selectedImages);

        if (isMatch) {
            console.log(`✅ Image authentication successful for ${email}`);
            res.status(200).json({ message: "Image verification successful" });
        } else {
            console.warn("❌ Image authentication failed: Incorrect sequence.");
            res.status(400).json({ message: "Image verification failed (Wrong sequence)" });
        }
    } catch (error) {
        console.error("❌ Image verification error:", error);
        res.status(500).json({ message: "Server error during image verification." });
    }
});



// 🟢 LOGOUT USER
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("❌ Logout error:", err);
            return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie("connect.sid"); // Clear session cookie
        console.log("🔴 User logged out");
        res.status(200).json({ message: "Logout successful" });
    });
});

// 🟢 GET SESSION USER
router.get("/session", (req, res) => {
    console.log("🔍 Checking session:", req.session);
    if (req.session.user && req.session.trueAuth) {
        res.json({ session: req.session.user, trueAuth: true, fakeAuth: false });
    } else if (req.session.fakeAuth) {
        res.json({ session: null, trueAuth: false, fakeAuth: true });
    } else {
        res.status(401).json({ message: "Session expired" });
    }
});

router.post("/verify-fake-auth", (req, res) => {
    console.log("📩 Fake Auth Verification Requested.");

    // This should always fail since it's a trap for incorrect login
    res.status(403).json({ message: "Access Denied" });
});


module.exports = router;
