// cli/userCLI.js
import { select, input } from '@inquirer/prompts';
import userService from '../NoRelational/services/userService.js';

export async function userMenu() {
  const action = await select({
    message: 'Usuários:',
    choices: [
      { name: 'Criar usuário', value: 'create' },
      { name: 'Listar usuários', value: 'list' },
      { name: 'Atualizar usuário', value: 'update' },
      { name: 'Deletar usuário', value: 'delete' },
      { name: 'Voltar', value: 'back' },
    ],
  });

  switch (action) {
    case 'create':
      await createUserCLI();
      break;

    case 'list':
      await listUsersCLI();
      break;

    case 'update':
      await updateUserCLI();
      break;

    case 'delete':
      await deleteUserCLI();
      break;

    case 'back':
      return;
  }

  return userMenu();
}

async function createUserCLI() {
  const name = await input({
    message: 'Nome:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  const email = await input({
    message: 'Email:',
  });

  try {
    const user = await userService.createUser({ name, email });
    console.log(`Usuário criado com id ${user._id}: ${user.name}`);
  } catch (e) {
    console.log('Erro:', e.message);
  }
}

async function listUsersCLI() {
  try {
    const users = await userService.listUsers();

    if (users.length === 0) {
      console.log('Nenhum usuário encontrado.');
      return;
    }

    console.table(
      users.map((user) => ({
        id: user._id.toString(),
        nome: user.name,
        email: user.email || '',
        criadoEm: user.createdAt
          ? new Date(user.createdAt).toISOString().slice(0, 10)
          : '',
      }))
    );
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function updateUserCLI() {
  const name = await input({
    message: 'Nome do usuário:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  const newName = await input({
    message: 'Novo nome (opcional):',
  });

  const email = await input({
    message: 'Novo email (opcional):',
  });

  const data = {};
  if (newName && newName.trim() !== '') data.name = newName.trim();
  if (email !== undefined) data.email = email.trim() ? email.trim() : '';

  try {
    const user = await userService.updateUserByName(name, data);
    console.log(`Usuário atualizado ${user._id}: ${user.name}`);
  } catch (e) {
    console.log('Erro:', e.message);
  }
}

async function deleteUserCLI() {
  const name = await input({
    message: 'Nome do usuário:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  try {
    const res = await userService.deleteUserByName(name);
    console.log(res.message);
  } catch (e) {
    console.log('Erro:', e.message);
  }
}
