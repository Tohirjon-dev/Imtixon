import Jwt from "jsonwebtoken";

class jwtService {
  constructor() {
    this.secretKey = process.env.Jwt_Secret_Key;
    this.jwt = Jwt;
  }
  async generateToken(payload) {
    return this.jwt.sign(payload, this.secretKey, { expiresIn: "1w" });
  }
  async verifyToken(token) {
    try {
      const decoded = this.jwt.verify(token, this.secretKey);
      return decoded;
    } catch ({ message }) {
      throw new Error(message);
    }
  }
}
export default jwtService;
