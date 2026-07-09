import { select, input } from "@inquirer/prompts";
import registerService from "../NoRelational/services/registerService.js";
import categoryService from "../NoRelational/services/categoryService.js";

export async function registerMenu() {
  const action = await select({
    message: "Registros:",
    choices: [
      { name: "Criar registro", value: "create" },
      { name: "Listar meus registros", value: "list" },
      { name: "Atualizar registro", value: "update" },
      { name: "Deletar registro", value: "delete" },
      { name: "Voltar", value: "back" },
    ],
  });

  switch (action) {
    case "create":
      await createRegisterCLI();
      break;

    case "list":
      await listRegistersCLI();
      break;

    case "update":
      await updateRegisterCLI();
      break;

    case "delete":
      await deleteRegisterCLI();
      break;

    case "back":
      return;
  }

  return registerMenu();
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

async function createRegisterCLI() {
  const title = await input({
    message: "Título:",
    validate: (v) => v.trim() !== "" || "Obrigatório",
  });

  const description = await input({
    message: "Descrição:",
  });

  const category = await select({
    message: "Categoria:",
    choices: [
      ...(await categoryService.listCategories()).map((item) => ({
        name: item.name,
        value: item._id.toString(),
      })),
    ],
  });

  const dueDate = await input({
    message: "Prazo (opcional) - formato YYYY-MM-DD:",
    validate: (v) => {
      if (v.trim() === "") return true;

      const match = /^\d{4}-\d{2}-\d{2}$/.test(v.trim());

      if (!match) return "Use YYYY-MM-DD";

      const [year, month, day] = v.trim().split("-").map(Number);

      const date = new Date(year, month - 1, day);

      if (isNaN(date.getTime())) return "Data inválida";

      return true;
    },
  });

  try {
    const register = await registerService.createRegister({
      title,
      description,
      categoryId: category || undefined,
      dueDate: dueDate ? `${dueDate}T00:00:00.000Z` : undefined,
    });

    const categoryName = register.categoryId?.name || "Sem categoria";

    console.log(`Registro criado com id ${register._id}.`);
    console.log(`Título: ${register.title}`);
    console.log(`Categoria: ${categoryName}`);
    console.log(`Prazo: ${formatDate(register.dueDate) || "-"}`);
    console.log(`Status: ${register.status}`);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function listRegistersCLI() {
  try {
    const registers = await registerService.getMyRegisters();

    if (registers.length === 0) {
      console.log("Nenhum registro encontrado.");
      return;
    }

    console.table(
      registers.map((register) => ({
        id: register._id.toString(),
        titulo: register.title,
        status: register.status,
        categoria: register.categoryId?.name || "",
        prazo: formatDate(register.dueDate),
      })),
    );
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function updateRegisterCLI() {
  const title = await input({
    message: "Título do registro:",
    validate: (v) => v.trim() !== "" || "Obrigatório",
  });

  const newTitle = await input({
    message: "Novo título (opcional):",
  });

  const description = await input({
    message: "Nova descrição (opcional):",
  });

  const status = await select({
    message: "Novo status (opcional):",
    choices: [
      { name: "Manter atual", value: "" },
      { name: "Pendente", value: "pendente" },
      { name: "Concluído", value: "concluido" },
    ],
  });

  const category = await select({
    message: "Nova categoria (opcional):",
    choices: [
      { name: "Manter atual", value: "" },
      ...(await categoryService.listCategories()).map((item) => ({
        name: item.name,
        value: item._id.toString(),
      })),
    ],
  });

  const dueDate = await input({
    message: "Novo prazo (opcional) - formato YYYY-MM-DD:",
    validate: (v) => {
      if (v.trim() === "") return true;

      const match = /^\d{4}-\d{2}-\d{2}$/.test(v.trim());

      if (!match) return "Use YYYY-MM-DD";

      const [year, month, day] = v.trim().split("-").map(Number);

      const date = new Date(year, month - 1, day);

      if (isNaN(date.getTime())) return "Data inválida";

      return true;
    },
  });

  const data = {};

  if (newTitle.trim() !== "") data.title = newTitle.trim();
  if (description.trim() !== "") data.description = description.trim();
  if (status) data.status = status;
  if (category !== undefined) data.categoryId = category || undefined;
  if (dueDate) data.dueDate = `${dueDate}T00:00:00.000Z`;
  else if (dueDate === "") data.dueDate = "";

  try {
    const updated = await registerService.updateRegisterByTitle(title, data);

    const categoryName = updated.categoryId?.name || "Sem categoria";

    console.log(`Registro atualizado ${updated._id}.`);
    console.log(`Título: ${updated.title}`);
    console.log(`Categoria: ${categoryName}`);
    console.log(`Prazo: ${formatDate(updated.dueDate) || "-"}`);
    console.log(`Status: ${updated.status}`);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function deleteRegisterCLI() {
  const title = await input({
    message: "Título do registro:",
    validate: (v) => v.trim() !== "" || "Obrigatório",
  });

  try {
    const result = await registerService.deleteRegisterByTitle(title);
    console.log(result.message);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}
