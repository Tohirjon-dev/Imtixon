import { Router } from "express";
import postController from "../controllers/post.controller.js";

const postRouter = Router();
const controller = new postController();

postRouter.post("/auth/posts", (req, res) =>
  controller.addPostsController(req, res)
);
postRouter.post("/posts/create", (req, res) =>
  controller.createPostController(req, res)
);
postRouter.get("/posts/category/:category", (req, res) =>
  controller.getPostsByCategoryController(req, res)
);
postRouter.get("/posts/top", (req, res) =>
  controller.getTopPostController(req, res)
);
postRouter.put("/posts/:id", (req, res) =>
  controller.updatePostByIdController(req, res)
);
postRouter.get("/users/posts", (req, res) =>
  controller.getAllUserPostsByTokenController(req, res)
);
postRouter.delete("/posts/:id", (req, res) =>
  controller.deletePostByIdController(req, res)
);
postRouter.get("/posts/search", (req, res) =>
  controller.searchPostController(req, res)
);
export default postRouter;
