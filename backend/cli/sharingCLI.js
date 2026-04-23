// cli/sharingCLI.js
import { select, input } from "@inquirer/prompts";
import sharingService from "../Relational/services/sharingService.js";

export async function sharingMenu() {
  const action = await select({
    message: "Compartilhamento:",
    choices: [
      { name: "Compartilhar registro", value: "share" },
      { name: "Ver meus registros compartilhados", value: "report" },
      { name: "Ver compartilhados comigo", value: "list" },
      { name: "Remover compartilhamento", value: "remove" },
      { name: "Voltar", value: "back" },
    ],
  });

  switch (action) {
    case "share":
      await shareRegisterCLI();
      break;

    case "list":
      await listSharedCLI();
      break;

    case "remove":
      await removeSharingCLI();
      break;

    case "report":
      await reportMySharedRegistersCLI();
      break;

    case "back":
      return;
  }

  return sharingMenu();
}

async function shareRegisterCLI() {
  const recordId = Number(
    await input({
      message: "ID do registro a ser compartilhado:",
      validate: (v) => !isNaN(v) || "Número inválido",
    }),
  );

  const targetUserId = Number(
    await input({
      message: "ID do usuário com quem compartilhar:",
      validate: (v) => !isNaN(v) || "Número inválido",
    }),
  );

  const permission = await select({
    message: "Permissão:",
    choices: [
      { name: "Leitura", value: "read" },
      { name: "Escrita", value: "write" },
    ],
  });

  try {
    const result = await sharingService.shareRegister(
      recordId,
      targetUserId,
      permission,
    );

    console.log("Compartilhado:", result);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function listSharedCLI() {
  try {
    const shared = await sharingService.getSharedWithMe();
    console.table(shared);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function removeSharingCLI() {
  const recordId = Number(
    await input({
      message: "ID do registro:",
      validate: (v) => !isNaN(v) || "Número inválido",
    }),
  );

  try {
    const result = await sharingService.removeSharing(recordId);

    console.log(result.message);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}

async function reportMySharedRegistersCLI() {
  try {
    const data = await sharingService.getMySharedRegistersWithUsers();

    console.table(data);
  } catch (err) {
    console.log("Erro:", err.message);
  }
}
