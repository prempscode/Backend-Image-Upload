const express = require("express");
const app = express();
const multer = require("multer");
const { uploadFile, deleteFile } = require("./services/storage.service");
const postModel = require("./models/post.model");

// middlewares
app.use(express.json());

// Configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

// get
app.get("/posts", async (req, res) => {
  const fetchedPosts = await postModel.find();
  res.status(200).json({ message: "post showed up", fetchedPosts });
});

// post
app.post("/create-post", upload.single("image"), async (req, res) => {
// upload.single("image") -> Use it as middleware — accept one file from the "image" field
  const postData = {
    caption: req.body.caption,
  };

  if (req.file) {
    const result = await uploadFile(req.file.buffer);

    postData.image = result.url;
    postData.fileId = result.fileId;
  }

  const post = await postModel.create(postData);

  res.status(201).json({ message: "post created successfully", post });
});

// patch
app.patch("/posts/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const oldPost = await postModel.findById(id);

  // if someone try to give invalid id
  if (!oldPost) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const updatedPost = {};

  let result;

  if (req.file) {
    // now delete the file from the imagekit server too
    // we will require the deleteFile fxn from the storage.service.js
    await deleteFile(oldPost.fileId);

    result = await uploadFile(req.file.buffer);
    updatedPost.image = result.url;
    updatedPost.fileId = result.fileId;
  }

  if (req.body.caption) {
    updatedPost.caption = req.body.caption;
  }

  let post;
  if (Object.keys(updatedPost).length) {
    post = await postModel.findByIdAndUpdate(id, updatedPost, { new: true });
  }

  res.status(200).json({ message: "Post updated", post });
});

// delete post
app.delete("/posts/:id", async (req, res) => {
  const id = req.params.id;
  let post = await postModel.findById(id);
  // if someone try to give invalid id
  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (post.fileId) {
    await deleteFile(post.fileId);
  }
  await postModel.findByIdAndDelete(id);

  res.status(200).json({
    message: "Post deleted successfully",
  });
});

module.exports = app;
