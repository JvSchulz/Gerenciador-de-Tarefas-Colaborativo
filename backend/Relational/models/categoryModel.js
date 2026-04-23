import { db } from "../../config/db.js";

const Category = {
  create: async (data) => {
    const [newCategory] = await db("categories")
      .insert({
        name: data.name,
      })
      .returning("*");

    return newCategory;
  },

  findAllCategories: async () => {
    return await db("categories").select("*");
  },

  updateCategory: async (id, category) => {
    const [updateCategory] = await db("categories")
      .where({ id })
      .update(category)
      .returning("*");

    return updateCategory;
  },

  delete: async (id) => {
    return await db("categories").where({ id }).del();
  },
};

export default Category;
