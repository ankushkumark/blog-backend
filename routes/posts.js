const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");

// Create post
router.post(
  "/",
  [auth, [check("title", "Title is required").notEmpty(), check("content", "Content is required").notEmpty()]],
  postController.createPost
);

// Get all posts (public)
router.get("/", postController.getPosts);

// Get single post
router.get("/:id", postController.getPost);

// Update post
router.put("/:id", auth, postController.updatePost);

// Delete post
router.delete("/:id", auth, postController.deletePost);
router.post("/:id/react", auth, postController.reactToPost);
router.post("/:id/comment", auth, postController.addComment);

module.exports = router;
