import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => (a < b ? [a, b] : [b, a]);

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString();

    const recepientId = req.body?.recepientId ?? null;

    const memberIds = req.body?.memberIds ?? [];

    if (!recepientId && memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Cần cung cấp recepientId hoặc memberIds" });
    }

    if (recepientId) {
      const [userA, userB] = pair(me, recepientId);

      const isFriend = await Friend.find({ userA, userB });

      if (!isFriend) {
        return res
          .status(403)
          .json({ message: "Bạn chưa kết bạn với người này" });
      }

      return next();
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const friend = await Friend.findOne({ userA, userB });

      return friend ? null : memberId;
    });

    const result = await Promise.all(friendChecks);
    const notFriends = result.filter(Boolean);

    if (notFriends.length > 0) {
      return res
        .status(403)
        .json({ message: "Bạn chỉ có thể thêm bạn bè vào nhóm", notFriends });
    }

    next();
  } catch (error) {
    console.error("Lỗi xảy ra khi checkFriendship", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
