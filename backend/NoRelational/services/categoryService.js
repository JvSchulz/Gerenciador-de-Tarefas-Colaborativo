import Category from '../models/categoryModel.js';

const categoryService = {
  async createCategory(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Nome da categoria é obrigatório.');
    }

    return Category.create({
      name: data.name.trim(),
    });
  },

  async listCategories() {
    return Category.find().sort({ name: 1 });
  },

  async findCategoryByName(name) {
    if (!name) return null;

    return Category.findOne({ name: name.trim() });
  },

  async updateCategoryByName(name, data) {
    const category = await Category.findOne({ name: name.trim() });

    if (!category) {
      throw new Error('Categoria não encontrada.');
    }

    if (!data.name || data.name.trim() === '') {
      throw new Error('Nome da categoria é obrigatório.');
    }

    return Category.findByIdAndUpdate(
      category._id,
      { name: data.name.trim() },
      { new: true }
    );
  },

  async deleteCategoryByName(name) {
    const category = await Category.findOne({ name: name.trim() });

    if (!category) {
      throw new Error('Categoria não encontrada.');
    }

    await Category.findByIdAndDelete(category._id);

    return { message: 'Categoria removida com sucesso.' };
  },
};

export default categoryService;
