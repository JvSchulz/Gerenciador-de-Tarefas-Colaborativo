import Category from "../models/categoryModel.js";

const categoryService = {
  createCategory: async (data) => {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Nome da categoria é obrigatório.");
    }

    return Category.create({
      name: data.name.trim(),
    });
  },

  listCategories: async () => {
    return Category.findAllCategories();
  },

  updateCategory: async (id, data) => {
    if (!id) {
      throw new Error("ID é obrigatório.");
    }

    if (!data.name || data.name.trim() === "") {
      throw new Error("Nome não pode ser vazio.");
    }

    const updated = await Category.updateCategory(id, {
      name: data.name.trim(),
    });

    if (!updated) {
      throw new Error("Categoria não encontrada.");
    }

    return updated;
  },

  deleteCategory: async (id) => {
    if (!id) {
      throw new Error("ID é obrigatório.");
    }

    const deleted = await Category.delete(id);

    if (!deleted) {
      throw new Error("Categoria não encontrada.");
    }

    return { message: "Categoria removida com sucesso." };
  },
};

export default categoryService;
