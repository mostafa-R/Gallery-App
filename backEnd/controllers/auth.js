const User = require("../models/User");
const jwtHelpers = require("../utils/jwtHelpers");
const { setJwtCookie } = require("../utils/cookies");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "The Email you've entered is incorrect.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "The password you've entered is incorrect.",
      });
    }

    const accessToken = jwtHelpers.sign(
      { sub: user.id },
      process.env.JWT_SECRET
    );

    res.cookie("jwtToken", accessToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    console.log("Access Token:", accessToken);

    res.json({
      status: "ok",
      data: {
        id: user.id,
        name: user.name,
        jwtToken: accessToken,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email is already registered",
      });
    }

    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    await newUser.save();

    const accessToken = jwtHelpers.sign(
      { sub: newUser.id },
      process.env.JWT_SECRET
    );

    res.cookie("jwtToken", accessToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.json({
      status: "ok",
      data: {
        id: newUser.id,
        name: newUser.name,
        jwtToken: accessToken,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

exports.uploadUserPhoto = async (req, res) => {
  try {
    const uploadPhoto = await User.findByIdAndUpdate(req.userId, {
      picturePath: "/public/images/" + req.file.filename,
    });
    res.status(200).json({
      message: "تم إضافة الصورة بنجاح",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, password } = req.body;
    const saltRounds = 8;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const updatedUser = await User.findByIdAndUpdate(req.userId, {
      name,
      password: hashedPassword,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwtToken", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.json({ status: "ok", message: "Logout successful" });
};
