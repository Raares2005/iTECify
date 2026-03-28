import asyncHandler from "express-async-handler";

//@desc   Get user profile
//route   GET /api/users/profile
//@access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    services: req.user.services
  }; 
  res.status(200).json(user);
});