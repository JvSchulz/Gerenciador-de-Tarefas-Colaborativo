import { db } from "../../config/db.js";


const User = {
  create: async (data) => {
    const [newUser] = await db("users")
      .insert({
        name: data.name,
        email: data.email,
      })
      .returning("*");

    return newUser;
  },

  findAll: async (id) => {
    return await db("users").select("*");
  },

  updateUser: async (id, register) => {
    const [updatedUser] = await db("users")
      .where({ id })
      .update(register)
      .returning("*");

    return updatedUser;
  },

  findByEmail: async (email) => {
    return db("users").where({ email }).first();
  },

  delete: async (id) => {
    return await db("users").where({ id }).del();
  },
};

export default User;
