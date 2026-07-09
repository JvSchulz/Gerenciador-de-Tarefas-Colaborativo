// cli/categoryCLI.js
import { select, input } from '@inquirer/prompts';
import categoryService from '../NoRelational/services/categoryService.js';

export async function categoryMenu() {
  const action = await select({
    message: 'Categorias:',
    choices: [
      { name: 'Criar', value: 'create' },
      { name: 'Listar', value: 'list' },
      { name: 'Atualizar', value: 'update' },
      { name: 'Deletar', value: 'delete' },
      { name: 'Voltar', value: 'back' },
    ],
  });

  switch (action) {
    case 'create':
      await createCategoryCLI();
      break;

    case 'list':
      await listCategoriesCLI();
      break;

    case 'update':
      await updateCategoryCLI();
      break;

    case 'delete':
      await deleteCategoryCLI();
      break;

    case 'back':
      return;
  }

  return categoryMenu();
}

async function createCategoryCLI() {
  const name = await input({
    message: 'Nome da categoria:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  try {
    const category = await categoryService.createCategory({ name });
    console.log(`Categoria criada ${category._id}: ${category.name}`);
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function listCategoriesCLI() {
  try {
    const categories = await categoryService.listCategories();

    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada.');
      return;
    }

    console.table(
      categories.map((category) => ({
        id: category._id.toString(),
        nome: category.name,
      }))
    );
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function updateCategoryCLI() {
  const name = await input({
    message: 'Nome da categoria:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  const newName = await input({
    message: 'Novo nome:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  try {
    const category = await categoryService.updateCategoryByName(name, { name: newName });
    console.log(`Categoria atualizada ${category._id}: ${category.name}`);
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function deleteCategoryCLI() {
  const name = await input({
    message: 'Nome da categoria:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  try {
    const result = await categoryService.deleteCategoryByName(name);
    console.log(result.message);
  } catch (err) {
    console.log('Erro:', err.message);
  }
}
