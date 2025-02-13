import { userModel } from "../models/user.model.js";
import joiService from "./joi.service.js";
import jwtService from "./jwt.service.js";
import bcrypt from "bcrypt";

class userService {
  constructor() {
    this.jwtService = new jwtService();
    this.joiService = new joiService();
    this.userModel = userModel;
  }
  async register(user) {
    const validateUser = await this.joiService.validateUsers(user);
    const hashedPassword = await bcrypt.hash(user.password, 12);
    await this.userModel.create({
      ...validateUser,
      password: hashedPassword,
    });
    const token = await this.jwtService.generateToken({
      username: user.username,
      email: user.email,
    });
    return {
      token: token,
      user: {
        username: validateUser.username,
        email: validateUser.email,
      },
    };
  }
  async login(userData) {
    const user = await this.userModel.findOne({ email: userData.email });
    if (!user) throw new Error("User topilmadi");
    const isMatch = await bcrypt.compare(userData.password, user.password);
    if (!isMatch) throw new Error("Parol noto'g'ri");

    const token = await this.jwtService.generateToken({
      userId: user._id,
      email: user.email,
    });
    return {
      token: token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }
}

export default userService;
