import asyncHandler from 'express-async-handler';
import File from '../../models/fileModel.js';

export const getFileById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const file = await File.findById(id);

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  res.status(200).json(file);
});