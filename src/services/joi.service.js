import Joi from "joi";

class joiService {
  constructor() {
    this.joi = Joi;
  }
  async validateUsers(user) {
    try {
      const userSchema = this.joi.object({
        username: this.joi.string().min(3).max(15).required(),
        email: this.joi.string().required(),
        password: this.joi.string().min(4).max(10).required(),
        role: this.joi.string(),
      });

      return await userSchema.validateAsync(user);
    } catch ({ message }) {
      throw new Error(message);
    }
  }
  async validatePosts(posts) {
    try {
      const postSchema = this.joi.object({
        title: this.joi.string().required(),
        content: this.joi.string(),
        author: this.joi.string().required(),
        category: this.joi.string(),
        views: this.joi.number().min(0),
        createdAt: this.joi.date(),
      });
      const schema = Array.isArray(posts)
        ? this.joi.array().items(postSchema).min(1)
        : postSchema;

      return await schema.validateAsync(posts);
    } catch ({ message }) {
      throw new Error(message);
    }
  }
}

export default joiService;
