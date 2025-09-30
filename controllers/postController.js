const { validationResult } = require("express-validator");
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image || null,  
      author: req.user.id,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")              
      .populate("comments.user", "name email");      

    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();

    // ✅ Author + comments populate 
    post = await Post.findById(post._id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};


exports.deletePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    await post.deleteOne(); // ✅ instead of remove()
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// ✅ Add or update reaction
// ✅ React to a Post
exports.reactToPost = async (req, res) => {
  try {
    const { type } = req.body; // like/love/laugh/null
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );

    if (type) {
      post.likes.push({ user: req.user.id, type });
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// ✅ Add Comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const newComment = {
      user: req.user.id,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
