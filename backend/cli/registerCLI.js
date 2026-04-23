// cli/registerCLI.js
import { select, input } from "@inquirer/prompts";
import registerService from "../Relational/services/registerService.js";

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

async function createRegisterCLI() {
  const title = await input({
    message: "Título:",
    validate: (v) => v.trim() !== "" || "Obrigatório",
  });

  const description = await input({
    message: "Descrição:",
  });

  const category_id = Number(
    await input({
      message: "ID da categoria (opcional):",
      validate: (v) => v === "" || !isNaN(v) || "Número inválido",
    }),
  );

  const due_date = await input({
    message: "Prazo (opcional) - formato YYYY-MM-DD:",
    validate: (v) => {
      if (v.trim() === "") return true;

      const parts = v.split("-");
      if (parts.length !== 3) return "Use YYYY-MM-DD";

      const [year, month, day] = parts;

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return "Data inválida";
      }

      return true;
    },
  });

  try {
    const register = await registerService.createRegister({
      title,
      description,
      category_id: category_id ?? null,
      due_date
    });

    console.log("Criado:", register);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function listRegistersCLI() {
  try {
    const registers = await registerService.getMyRegisters();
    console.table(registers);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function updateRegisterCLI() {
  const id = Number(
    await input({
      message: "ID do registro:",
      validate: (v) => !isNaN(v) || "Número inválido",
    }),
  );

  const title = await input({
    message: "Novo título (opcional):",
  });

  const description = await input({
    message: "Nova descrição (opcional):",
  });

  const category_id = await input({
    message: "Novo ID da categoria (opcional):",
    validate: (v) => v === "" || !isNaN(v) || "Número inválido",
  });

  const fields = {};

  if (title.trim() !== "") {
    fields.title = title.trim();
  }

  if (description.trim() !== "") {
    fields.description = description.trim();
  }

  if (category_id !== "") {
    fields.category_id = Number(category_id);
  }

  console.log(fields)

  try {
    const updated = await registerService.updateRegister(id, fields);
    console.log("Atualizado:", updated);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function deleteRegisterCLI() {
  const id = Number(
    await input({
      message: "ID do registro:",
      validate: (v) => !isNaN(v) || "Número inválido",
    }),
  );

  try {
    const result = await registerService.deleteRegister(id);
    console.log(result.message);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}
