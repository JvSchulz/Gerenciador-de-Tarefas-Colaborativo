import { select, input } from "@inquirer/prompts";
import executionService from "../Relational/services/executionService.js";

const CURRENT_USER_ID = 1;

export async function executionMenu() {
  const action = await select({
    message: "Execução:",
    choices: [
      { name: "Executar registro", value: "executar" },
      { name: "Ver histórico de execuções", value: "historico" },
      { name: "Voltar", value: "voltar" },
    ],
  });

  switch (action) {
    case "executar":
      await executeRegisterCLI();
      break;

    case "historico":
      await listExecutionsCLI();
      break;

    case "voltar":
      return;
  }

  return executionMenu();
}

async function executeRegisterCLI() {
  const registerId = Number(
    await input({
      message: "ID do registro:",
      validate: (v) => !isNaN(v) || "Número inválido",
    }),
  );

  try {
    const result = await executionService.executeRegister(
      CURRENT_USER_ID,
      registerId,
    );

    console.log(result.message);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function listExecutionsCLI() {
  const data = await executionService.getMyExecutionHistory(CURRENT_USER_ID);

  console.table(data);
}
