import { db } from "../../config/db.js";

const DEFAULT_USER_ID = 1;

const Sharing = {
  create: async (data) => {
    const [sharing] = await db("sharing").insert(data).returning("*");

    return sharing;
  },

  findMySharedRegistersWithUsers: async () => {
    return db("registers as r")
      .join("sharing as s", "r.id", "s.register_id")
      .join("users as u", "s.user_id", "u.id")
      .leftJoin("categories as c", "r.category_id", "c.id")
      .where("r.creator_id", DEFAULT_USER_ID)
      .select(
        "r.id as register_id",
        "r.title",
        "r.status",
        "c.name as category",
        "u.id as user_id",
        "u.name as user_name",
        "s.permission",
        "s.shared_at",
      );
  },

  findSharedWithMe: async () => {
    return db("sharing as s")
      .join("registers as r", "s.register_id", "r.id")
      .join("users as u", "r.creator_id", "u.id")
      .leftJoin("categories as c", "r.category_id", "c.id")
      .where("s.user_id", DEFAULT_USER_ID)
      .select(
        "r.id as register_id",
        "r.title",
        "r.status",
        "c.name as category",
        "u.id as user_id",
        "u.name as user_name",
        "s.permission",
        "s.shared_at",
      );
  },

  async exists(userId, registerId) {
    const result = await db("sharing")
      .where({ user_id: userId, register_id: registerId })
      .first();

    return !!result;
  },

  removeShare: async (registerId) => {
    return await db("sharing").where({ register_id: registerId }).del();
  },
};

export default Sharing;
