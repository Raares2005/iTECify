import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken.js";
import User from "../../models/userModel.js";

//@desc   Auth user/set token
//route   POST /api/users/auth
//@access Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401).send("Invalid email or password");
  }
  generateToken(res, user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});