import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { ENV } from "../config/env.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRES_IN });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        message: "User Created Successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    console.log("Error Creating User ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const user_DB_Pass = await user.matchPassword(password);

    if (user && user_DB_Pass) {
      res.status(200).json({
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
          businessName: user.businessName || "",
          address: user.address || "",
          phone: user.phone || "",
        },
      });
    }
  } catch (error) {
    console.log("Error Logging In User ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    res.status(200).json({
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        businessName: user.businessName || "",
        address: user.address || "",
        phone: user.phone || "",
      },
    });
  } catch (error) {
    console.log("Error Getting User ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    // Update user logic here
    const user = await User.findById(req.user.id);

    if (!user) return res.status(401).json({ message: "User Not found" });

    user.name = req.body.name || user.name;
    user.businessName = req.body.businessName || user.businessName;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();
    res.status(200).json({
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error Updating User ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
