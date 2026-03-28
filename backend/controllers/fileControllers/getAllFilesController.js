import asyncHandler from "express-async-handler";
import File from "../../models/fileModel.js";

export const getFiles = asyncHandler(async (req, res) => {
  // OPTIONAL: if you have auth later
  // const userId = req.user._id;

  const files = await File.find()
    // If you want only user-related files later:
    // .find({ collaborators: userId })

    .select("_id name language updatedAt createdAt") // don't send full content here
    .sort({ updatedAt: -1 });

  res.status(200).json(files);
});

