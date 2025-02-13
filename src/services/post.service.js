import { postModel } from "../models/post.model.js";
import { userModel } from "../models/user.model.js";
import joiService from "./joi.service.js";
import jwtService from "./jwt.service.js";

class postService {
  constructor() {
    this.joiService = new joiService();
    this.postModel = postModel;
    this.userModel = userModel;
    this.jwtService = new jwtService();
  }
  async addPosts(posts) {
    const validatePosts = await this.joiService.validatePosts(posts);
    await this.postModel.create(validatePosts);
    return "succes";
  }
  async createPost(post, token) {
    const decodedToken = await this.jwtService.verifyToken(token);

    const validatePost = await this.joiService.validatePosts(post);
    const user = await this.userModel.findOne({ email: decodedToken.email });
    if (!user) throw new Error("Token noto'g'ri");
    const newPost = await this.postModel.create({
      title: validatePost.title,
      content: validatePost.content,
      author: user._id,
    });
    const postWithAuthor = await this.postModel
      .findById(newPost._id)
      .populate("author", "username email");
    return {
      success: true,
      post: {
        title: postWithAuthor.title,
        content: postWithAuthor.content,
        author: postWithAuthor.author._id,
        createdAt: postWithAuthor.createdAt,
      },
    };
  }

  async getPostByCategory(category) {
    const posts = await this.postModel
      .find({ category: category })
      .populate("author", "username");
    if (posts.length === 0)
      throw new Error("Bu kategoriyaga tegishli post topilmadi");
    const postWithAuthor = posts.map((post) => ({
      ...post.toObject(),
      author: post.author.username,
    }));
    return postWithAuthor;
  }
  async getTopPost() {
    const topPosts = await this.postModel.aggregate([
      { $sort: { views: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          title: 1,
          views: 1,
          author: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" },
      {
        $project: {
          title: 1,
          views: 1,
          author: "$authorDetails.username",
        },
      },
    ]);

    return topPosts[0];
  }
  async updatePostById(id, { title, content, category }) {
    if (!id || !title || !content || !category)
      throw new Error("Tahrirlash uchun maydonlarni to'liq kiritish shart!");

    const updatePost = await this.postModel.findByIdAndUpdate(
      id,
      {
        title: title,
        content: content,
        category: category,
      },
      { new: true }
    );
    if (!updatePost) throw new Error("Bunday id li post mavjud emas");
    return {
      succes: true,
      updatePost: {
        title: updatePost.title,
        content: updatePost.content,
      },
    };
  }
  async getAllUserPostsByToken(token) {
    const decodedToken = await this.jwtService.verifyToken(token);
    const user = await this.userModel.findOne({ email: decodedToken.email });
    if (!user) throw new Error("Token noto'g'ri");
    const userPosts = await this.postModel
      .find({ author: user._id })
      .populate("author", "username email");
    return {
      success: true,
      posts: userPosts.map((post) => ({
        title: post.title,
        category: post.category,
        views: post.views,
        createdAt: post.createdAt,
      })),
    };
  }
  async deletePostById(id) {
    const data = this.postModel.findOneAndDelete({ _id: id });
    if (!data) throw new Error("Bunday id li post mavjud emas");
    return {
      succes: true,
      message: "Post o'chirildi",
    };
  }
  async searchPost(title, category) {
    const Searchedpost = await this.postModel.find({
      title: title,
      category: category,
    });
    if (!Searchedpost) throw new Error("Bunday post mavjud emas");
    return {
      posts: Searchedpost.map((post) => ({
        title: post.title,
        content: post.content,
        category: post.category,
      })),
    };
  }
}
export default postService;
