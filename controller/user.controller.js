const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSignup = async (req, res) => {
  try {
    console.log(req.body, "asd");
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ message: "User Signup successfully", user: newUser });
  } catch (error) {
    console.log("Error while signup : " + error.message);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!user) {
      return res.status(400).json({ message: "Please singup first!" });
    }

    const checkedHashedPassword = await bcrypt.compare(
      password,
      user?.password
    );

    if (checkedHashedPassword) {
      var token = jwt.sign({ userID: user?._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: "Login successfully", user: user });
    }

    return res.status(401).json({ message: "Wrong credentials" });
  } catch (error) {
    console.log("Error while login : " + error.message);
  }
};

module.exports = { userSignup, userLogin };
