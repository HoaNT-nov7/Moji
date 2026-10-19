import bcrypt from "bcrypt";
import User from "../models/User.js";

export const signUp = async (req, res) => {
  try {
    // doc du lieu dau vao
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Khong the thieu username, password, email, firstName va lastName",
      });
    }

    // kiem tra username

    const duplicate = await User.findOne({ username });

    if (duplicate) {
      return res.status(409).json({ message: "Username da ton tai" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Loi khi goi signUp ", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};
