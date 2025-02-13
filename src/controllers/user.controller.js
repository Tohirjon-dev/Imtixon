import userService from "../services/user.service.js";

class userController {
  constructor() {
    this.service = new userService();
  }
  async registerController(req, res) {
    try {
      const body = req.body;
      const user = await this.service.register(body);
      if (user) res.status(201).json(user);
    } catch ({ message }) {
      res.status(400).json({ message });
    }
  }
  async loginController(req, res) {
    try {
      const data = req.body;
      const user = await this.service.login(data);
      if (user) res.json(user);
    } catch ({ message }) {
      res.status(400).json(message);
    }
  }
}
export default userController;
