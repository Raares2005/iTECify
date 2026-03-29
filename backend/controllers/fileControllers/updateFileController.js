import asyncHandler from 'express-async-handler';
import mongoose from "mongoose"
import File from '../../models/fileModel.js';

export const updateFileContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid file ID');
  }

  const file = await File.findById(id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  file.content = content ?? file.content;

  const updatedFile = await file.save();

  res.status(200).json(updatedFile);
});