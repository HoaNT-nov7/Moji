import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();

    const recepientId = req.body?.recepientId ?? null;

    if (!recepientId) {
      return res.status(400).json({ message: "Cần cung cấp recepientId" });
    }

    const [userA, userB] = pair(me, recepientId);

    const isFriend = await Friend.find({ userA, userB });

    if (!isFriend) {
      return res
        .status(403)
        .json({ message: "Bạn chưa kết bạn với người này" });
    }

    return next();
  } catch (error) {
    console.error("Lỗi xảy ra khi checkFriendship", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
