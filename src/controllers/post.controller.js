import mongoose from "mongoose";
import postService from "../services/post.service.js";

class postController {
  constructor() {
    this.service = new postService();
  }
  async addPostsController(req, res) {
    try {
      const posts = req.body;
      const data = await this.service.addPosts(posts);
      if (data)
        res.status(201).json({
          data,
          message: "Postlar bilan ishlash uchun qo'shimcha request qo'shdim",
        });
    } catch ({ message }) {
      res.status(400).json(message);
    }
  }
  async createPostController(req, res) {
    try {
      const post = req.body;
      const token = req.headers["authorization"]?.split(" ")[1];
      const data = await this.service.createPost(post, token);
      if (data) res.status(201).json(data);
    } catch ({ message }) {
      res.status(401).json(message);
    }
  }
  async getPostsByCategoryController(req, res) {
    try {
      const category = req.params.category;
      const data = await this.service.getPostByCategory(category);
      res.json(data);
    } catch ({ message }) {
      res.status(404).json(message);
    }
  }
  async getTopPostController(req, res) {
    try {
      const post = await this.service.getTopPost();
      res.json({ topPost: post });
    } catch ({ message }) {
      res.status(400).json(message);
    }
  }
  async updatePostByIdController(req, res) {
    try {
      const id = req.params.id;
      const body = req.body;
      const data = await this.service.updatePostById(id, body);
      res.json(data);
    } catch ({ message }) {
      res.status(401).json(message);
    }
  }
  async getAllUserPostsByTokenController(req, res) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      const posts = await this.service.getAllUserPostsByToken(token);
      res.json(posts);
    } catch ({ message }) {
      res.status(400).json(message);
    }
  }
  async deletePostByIdController(req, res) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const data = await this.service.deletePostById(id);
      res.json(data);
    } catch ({ message }) {
      res.status(400).json(message);
    }
  }
  async searchPostController(req, res) {
    try {
      const title = req.query.title;
      const category = req.query.category;
      const data = await this.service.searchPost(title, category);
      res.json(data);
    } catch ({ message }) {
      res.status(400).json(message);
    }
  }
}
export default postController;
