// cli/sharingCLI.js
import { select, input } from '@inquirer/prompts';
import sharingService from '../NoRelational/services/sharingService.js';
import registerService from '../NoRelational/services/registerService.js';
import userService from '../NoRelational/services/userService.js';

export async function sharingMenu() {
  const action = await select({
    message: 'Compartilhamento:',
    choices: [
      { name: 'Compartilhar registro', value: 'share' },
      { name: 'Registros que compartilhei', value: 'shared_mine' },
      { name: 'Registros compartilhados comigo', value: 'shared_with_me' },
      { name: 'Remover compartilhamento', value: 'remove' },
      { name: 'Voltar', value: 'back' },
    ],
  });

  switch (action) {
    case 'share':
      await shareRegisterCLI();
      break;

    case 'shared_with_me':
      await listSharedCLI();
      break;

    case 'shared_mine':
      await reportMySharedRegistersCLI();
      break;

    case 'remove':
      await removeSharingCLI();
      break;

    case 'back':
      return;
  }

  return sharingMenu();
}

async function shareRegisterCLI() {
  const currentUserId = (await userService.listUsers())[0]?._id?.toString();

  const registers = await registerService.getMyRegisters();

  if (registers.length === 0) {
    console.log('Nenhum registro disponível para compartilhar.');
    return;
  }

  const register = await select({
    message: 'Registro:',
    choices: registers.map((item) => ({
      name: `${item.title} (${item.status})`,
      value: item._id.toString(),
    })),
  });

  const users = await userService.listUsers();

  const targetUser = await select({
    message: 'Usuário para compartilhar:',
    choices: users
      .filter((item) => item._id.toString() !== currentUserId)
      .map((item) => ({
        name: `${item.name} - ${item.email}`,
        value: item._id.toString(),
      })),
  });

  const permission = await select({
    message: 'Permissão:',
    choices: [
      { name: 'Leitura', value: 'read' },
      { name: 'Escrita', value: 'write' },
    ],
  });

  try {
    const result = await sharingService.shareRegister(
      register,
      targetUser,
      permission
    );

    console.log(`Compartilhado com o usuário ${result.userId}.`);
    console.log(`Permissão: ${result.permission}`);
    console.log(`Compartilhado em: ${new Date(result.sharedAt).toISOString()}`);
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function listSharedCLI() {
  try {
    const shared = await sharingService.getSharedWithMe();

    if (shared.length === 0) {
      console.log('Nenhum registro compartilhado com você.');
      return;
    }

    console.table(
      shared.map((item) => {
        const register = item.registerId || {};

        return {
          idRegistro: register._id?.toString() ?? '',
          titulo: register.title ?? '',
          status: register.status ?? '',
          prazo: register.dueDate
            ? new Date(register.dueDate).toISOString().slice(0, 10)
            : '',
          compartilhadoEm: item.sharedAt
            ? new Date(item.sharedAt).toISOString().slice(0, 10)
            : '',
          permissao: item.permission ?? '',
          criador: register.creatorId?.name ?? '',
        };
      })
    );
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function reportMySharedRegistersCLI() {
  try {
    const items = await sharingService.getMySharedRegistersWithUsers();

    if (items.length === 0) {
      console.log('Você ainda não compartilhou nenhum registro.');
      return;
    }

    console.table(
      items.map((item) => ({
        idRegistro: item.registerId?._id?.toString() ?? '',
        titulo: item.registerId?.title ?? '',
        status: item.registerId?.status ?? '',
        compartilhadoEm: item.sharedAt
          ? new Date(item.sharedAt).toISOString().slice(0, 10)
          : '',
        permissao: item.permission ?? '',
        idUsuario: item.userId?._id?.toString() ?? '',
        nomeUsuario: item.userId?.name ?? '',
        emailUsuario: item.userId?.email ?? '',
      }))
    );
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function removeSharingCLI() {
  const registers = await registerService.getMyRegisters();

  if (registers.length === 0) {
    console.log('Nenhum registro disponível.');
    return;
  }

  const register = await select({
    message: 'Registro:',
    choices: registers.map((item) => ({
      name: `${item.title} (${item.status})`,
      value: item._id.toString(),
    })),
  });

  try {
    const result = await sharingService.removeSharing(register);
    console.log(result.message);
  } catch (err) {
    console.log('Erro:', err.message);
  }
}
