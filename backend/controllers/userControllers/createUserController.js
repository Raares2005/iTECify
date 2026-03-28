import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken.js";
import User from "../../models/userModel.js";
import { isEmailValid } from "../../utils/emailValidation.js";
import { isPassowrdValid } from "../../utils/passwordValidation.js";

//@desc   Register a new user
//route   POST /api/users
//@access Public
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const isUser = await User.findOne({ email });
  if (isUser) {
    res.status(400).send("User already exists!");
  }
  if (!isPassowrdValid(password) || !isEmailValid(email)) {
    res.status(422).send("Mail or password not valid!");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (!user) {
    res.status(400).send("Invalid user data!");
  }
  generateToken(res, user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});