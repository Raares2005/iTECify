
export const getFiles = asyncHandler(async (req, res) => {
  const files = await File.find().sort({ createdAt: -1 });
  res.json(files);
});