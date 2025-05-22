import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
});

// News modelini oluşturuyoruz
const News = mongoose.model("News", newsSchema);

export default News;
