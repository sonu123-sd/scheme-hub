import express = require("express");
import bcrypt = require("bcrypt");
import mongoose = require("mongoose");
import jwt = require("jsonwebtoken");
import cors = require("cors");
import crypto = require("crypto");

const savedSchemeRoutes = require("./routes/savedScheme.routes");
const contactRoutes = require("./routes/contact.routes");
const documentRoutes = require("./routes/document.routes");
const authMiddleware = require("./middleware/auth.middleware");
const User = require("./models/User.model");
const accountRoutes = require("./routes/account.routes");
const JWT_SECRET = "schemehub_secret_key";
const eligibilityRoutes = require("./routes/eligibility.routes");

const app = express();
const PORT = 5000;


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// CORS (MOST IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:8080", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/account", accountRoutes);
app.use("/contact", contactRoutes);
app.use("/documents", documentRoutes);
app.use("/saved-schemes", savedSchemeRoutes);
// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/schemehub")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully" });
});

/* ---------- REGISTER ---------- */
/* ---------- REGISTER ---------- */
app.post("/auth/register", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      surname,
      dob,
      gender,
      maritalStatus,
      caste,
      education,
      employment,
      mobile,
      email,
      state,
      password,
    } = req.body;

    //  STEP 1: Required fields check
    if (!firstName || !surname || !dob || !gender || !mobile || !email || !state || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    //  STEP 2: Email already exists check (FIRST)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //  STEP 3: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  STEP 4: Create user
    const user = new User({
      firstName,
      middleName,
      surname,
      dob,
      gender,
      maritalStatus,
      caste,
      education,
      employment,
      mobile,
      email,
      state,
      password: hashedPassword,
    });

    //  STEP 5: Save
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );
    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
/* ---------- LOGIN ---------- */
app.post("/auth/login", async (req, res) => {
  try {
    const { identifier, email, mobile, password } = req.body;
    const loginIdentifier = (identifier || email || mobile || "").toString().trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Email/phone and password required" });
    }

    const user = await User.findOne({
      $or: [
        { email: loginIdentifier.toLowerCase() },
        { mobile: loginIdentifier },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email/phone or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email/phone or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
/* ---------- FORGOT PASSWORD ---------- */
app.post("/auth/forgot-password", async (req, res) => {
  const { identifier, email, mobile } = req.body;
  const rawIdentifier = (identifier || email || mobile || "").toString().trim();

  if (!rawIdentifier) {
    return res.status(400).json({ message: "Email or phone number is required" });
  }

  const user = await User.findOne({
    $or: [
      { email: rawIdentifier.toLowerCase() },
      { mobile: rawIdentifier },
    ],
  });
  if (!user) {
    return res.status(404).json({ message: "Email or phone number not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  console.log("RESET TOKEN ", resetToken);

  return res.status(200).json({
    resetToken, //  THIS MUST BE HERE
  });
});
/* ---------- RESET PASSWORD ---------- */
app.post("/auth/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.put("/auth/profile", authMiddleware, async (req: any, res: any) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      req.body,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


/* ---------- PROFILE ---------- */
app.get("/auth/profile", authMiddleware, async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
