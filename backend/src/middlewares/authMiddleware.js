import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Khong tim thay access token" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);

          return res
            .status(403)
            .json({ message: "access token het han hoac khong dung" });
        }

        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );

        if (!user) {
          return res.status(404).json({ message: "user khong ton tai" });
        }

        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Loi khi xac minh user voi JWT", error);
    res.status(500).json({ message: "Loi he thong" });
  }
};
