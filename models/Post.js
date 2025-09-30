const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // ✅ Cloudinary image URL
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Reactions (Like/Love/Laugh)
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: { type: String, enum: ["like", "love", "laugh"] },
      },
    ],

    // ✅ Comments
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
