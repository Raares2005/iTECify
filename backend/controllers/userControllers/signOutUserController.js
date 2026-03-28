import asyncHandler from "express-async-handler";

//@desc   Log out user
//route   POST /api/users/logout
//@access Public
export const logoutUser = asyncHandler(async (req, res) => {
  res
    .cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .status(200)
    .json({ message: "User logged out!" }); // Return as a JSON object
});