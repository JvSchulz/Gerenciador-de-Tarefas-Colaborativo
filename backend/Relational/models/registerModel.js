import { db } from "../../config/db.js";

const DEFAULT_USER_ID = 1;

const Register = {
  create: async (data) => {
    const [newRegister] = await db("registers").insert(data).returning("*");

    return newRegister;
  },

  findById: async (id) => {
    return await db("registers").where({ id }).first();
  },

  findMyRegisters: async () => {
    return db("registers as r")
      .leftJoin("categories as c", "r.category_id", "c.id")
      .where("r.creator_id", DEFAULT_USER_ID)
      .select(
        "r.id",
        "r.title",
        "r.description",
        "r.status",
        "r.created_at",
        "r.due_date",
        "c.name as category",
      ).orderBy("r.id")
  },

  findMyRegistersWithShareCount: async (userId) => {
    return db("registers as r")
      .leftJoin("sharing as s", "r.id", "s.register_id")
      .where("r.creator_id", userId)
      .groupBy("r.id")
      .select(
        "r.id",
        "r.title",
        "r.status",
        db.raw("COUNT(s.user_id) as share_count"),
      );
  },

  updateRegister: async (id, register) => {
    const [updatedRegister] = await db("registers")
      .where({ id })
      .update(register)
      .returning("*");

    return updatedRegister;
  },

  async isOwner(registerId) {
    const register = await db("registers")
      .where({ id: registerId, creator_id: DEFAULT_USER_ID })
      .first();

    return !!register;
  },

  delete: async (id) => {
    return await db("registers").where({ id }).del();
  },
};

export default Register;
