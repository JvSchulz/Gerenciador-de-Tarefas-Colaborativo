// cli/userCLI.js
import { select, input } from '@inquirer/prompts';
import userService from '../Relational/services/userService.js';

export async function userMenu() {

  const action = await select({
    message: "Usuários:",
    choices: [
      { name: "Criar usuário", value: "create" },
      { name: "Listar usuários", value: "list" },
      { name: "Atualizar usuário", value: "update" },
      { name: "Deletar usuário", value: "delete" },
      { name: "Voltar", value: "back" },
    ],
  });

  switch (action) {
    case "create":
      await createUserCLI();
      break;

    case "list":
      console.table(await userService.listUsers());
      break;

    case "update":
      await updateUserCLI();
      break;

    case "delete":
      await deleteUserCLI();
      break;

    case "back":
      return;
  }

  return userMenu();
}

async function createUserCLI() {
  const name = await input({ message: "Nome:" });
  const email = await input({ message: "Email:" });

  try {
    const user = await userService.createUser({ name, email });
    console.log(user);
  } catch (e) {
    console.log(e.message);
  }
}

async function updateUserCLI() {
  const id = Number(await input({ message: "ID:" }));
  const name = await input({ message: "Nome (opcional):" });
  const email = await input({ message: "Email (opcional):" });

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;

  try {
    const user = await userService.updateUser(id, data);
    console.log(user);
  } catch (e) {
    console.log(e.message);
  }
}

async function deleteUserCLI() {
  const id = Number(await input({ message: "ID:" }));

  try {
    const res = await userService.deleteUser(id);
    console.log(res.message);
  } catch (e) {
    console.log(e.message);
  }
}