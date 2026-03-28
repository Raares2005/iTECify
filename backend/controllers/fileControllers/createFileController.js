import asyncHandler from "express-async-handler";
import File from "../../models/fileModel.js";

export const createFile = asyncHandler(async (req, res) => {
  const { name, language } = req.body;

  // Optional: if you add auth later
  // const userId = req.user?._id;

  // Basic validation
  if (name && name.trim() === "") {
    res.status(400);
    throw new Error("File name cannot be empty");
  }

  const file = await File.create({
    name: name || "untitled",
    content: "",
    language: language || "javascript",
    collaborators: [],
  });

  res.status(201).json(file);
});