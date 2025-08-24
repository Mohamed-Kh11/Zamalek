import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String, // store image URL
    default: ""
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model("News", newsSchema);
