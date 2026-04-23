// cli/categoryCLI.js
import { select, input } from "@inquirer/prompts";
import categoryService from "../Relational/services/categoryService.js";

export async function categoryMenu() {
  const action = await select({
    message: "Categorias:",
    choices: [
      { name: "Criar", value: "create" },
      { name: "Listar", value: "list" },
      { name: "Atualizar", value: "update" },
      { name: "Deletar", value: "delete" },
      { name: "Voltar", value: "back" },
    ],
  });

  switch (action) {
    case "create":
      await createCategoryCLI();
      break;

    case "list":
      await listCategoriesCLI();
      break;

    case "update":
      await updateCategoryCLI();
      break;

    case "delete":
      await deleteCategoryCLI();
      break;

    case "back":
      return;
  }

  return categoryMenu();
}

async function createCategoryCLI() {
  const name = await input({
    message: "Nome da categoria:",
    validate: (v) => v.trim() !== "" || "Obrigatório",
  });

  try {
    const category = await categoryService.createCategory({ name });
    console.log("Criada:", category);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function listCategoriesCLI() {
  try {
    const categories = await categoryService.listCategories();
    console.table(categories);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function updateCategoryCLI() {
  const id = Number(
    await input({
      message: "ID da categoria:",
      validate: (v) => !isNaN(v) || "Número inválido",
    })
  );

  const name = await input({
    message: "Novo nome:",
    validate: (v) => v.trim() !== "" || "Obrigatório",
  });

  try {
    const category = await categoryService.updateCategory(id, { name });
    console.log("Atualizada:", category);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function deleteCategoryCLI() {
  const id = Number(
    await input({
      message: "ID da categoria:",
      validate: (v) => !isNaN(v) || "Número inválido",
    })
  );

  try {
    const result = await categoryService.deleteCategory(id);
    console.log(result.message);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}