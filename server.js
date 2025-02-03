const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const imgRoutes = require("./routes/imgRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

// ✅ MongoDB session storage
app.use(
  session({
    secret: "graphical_auth_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60, // 1 hour session expiration
    }),
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);

// ✅ Debugging logs
app.use((req, res, next) => {
  console.log("🔍 Current Session Data:", req.session);
  next();
});

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/images", imgRoutes);

// ✅ Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
