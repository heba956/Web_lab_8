const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

let posts = [];
let comments = [];
let nextId = 1;
let nextCommentId = 1;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const db = {
  async getAllPosts() {
    await delay(100);
    return posts;
  },

  async getPost(id) {
    await delay(100);
    return posts.find((p) => p.id === id);          
  },

  async createPost(name, content) {
    await delay(100);
    const post = { id: nextId++, name, content };
    posts.push(post);
    return post;
  },

  async updatePost(id, changes) {
    await delay(100);
    const post = posts.find((p) => p.id === id);
    if (!post) return undefined;
    if (changes.name !== undefined) post.name = changes.name;
    if (changes.content !== undefined) post.content = changes.content;
    return post;
  },

  async deletePost(id) {
    await delay(100);
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    comments = comments.filter((c) => c.postId !== id);   // remove its comments too
    return true;
  },

  async getComments(postId) {
    await delay(100);
    return comments.filter((c) => c.postId === postId);
  },

  async createComment(postId, comment) {
    await delay(100);
    const newComment = { id: nextCommentId++, postId, comment };
    comments.push(newComment);
    return newComment;
  },
};


app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.post("/posts", async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: "name and content are required" });
    }
    const post = await db.createPost(name, content);
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const allPosts = await db.getAllPosts();
    res.json(allPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const post = await db.getPost(Number(req.params.id));
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/posts/:id", async (req, res) => {
  try {
    const post = await db.updatePost(Number(req.params.id), req.body);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  try {
    const deleted = await db.deletePost(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/posts/:id/comments", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const post = await db.getPost(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(await db.getComments(postId));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/posts/:id/comments", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const post = await db.getPost(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const { comment } = req.body;
    if (!comment) return res.status(400).json({ error: "comment is required" });

    const newComment = await db.createComment(postId, comment);
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});