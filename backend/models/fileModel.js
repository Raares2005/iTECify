import mongoose from "mongoose"

const fileSchema = new mongoose.Schema({
  name: String,
  content: String, // actual file content
  language: String,
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

export default File;