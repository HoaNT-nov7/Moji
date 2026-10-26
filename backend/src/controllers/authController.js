import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // ms

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

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thieu username hoac password" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "username hoac password khong chinh xac" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "username hoac password khong chinh xac" });
    }

    // tao accesstoken voi jWT

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    //tao refresh token

    const refreshToken = crypto.randomBytes(64).toString("hex");

    //tao session moi de luu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //tra refresh token ve cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });
    //tra access token ve res

    res
      .status(200)
      .json({ message: `User ${user.displayName} da dang nhap`, accessToken });
  } catch (error) {
    console.error("Loi khi goi signIn ", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

export const signOut = async (req, res) => {
  try {
    //lay refresh token tu cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xoa refresh token trong Session
      await Session.deleteOne({ refreshToken: token });

      //xoa cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Loi khi goi signOut", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};

// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại" });
    }

    //so sánh refresh token trong session
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn" });
    }

    // tạo access token mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
