import { select } from '@inquirer/prompts';

import { connectDb } from './config/db.js';
import { ensureDefaultUser } from './NoRelational/services/initService.js';

import { executionMenu } from './cli/executionCLI.js';
import { userMenu } from './cli/userCLI.js';
import { categoryMenu } from './cli/categoryCLI.js';
import { registerMenu } from './cli/registerCLI.js';
import { sharingMenu } from './cli/sharingCLI.js';
import { reportMenu } from './cli/reportCLI.js';

await connectDb();
await ensureDefaultUser();

async function mainMenu() {

  const option = await select({
    message: 'Menu Principal',
    choices: [
      { name: 'Usuários', value: 'users' },
      { name: 'Categorias', value: 'categories' },
      { name: 'Registros', value: 'registers' },
      { name: 'Compartilhamento', value: 'sharing' },
      { name: 'Execução', value: 'execution' },
      { name: 'Relatórios', value: 'reports' },
      { name: 'Sair', value: 'exit' },
    ],
  });

  switch (option) {
    case 'users':
      await userMenu();
      break;

    case 'categories':
      await categoryMenu();
      break;

    case 'registers':
      await registerMenu();
      break;

    case 'sharing':
      await sharingMenu();
      break;

    case 'execution':
      await executionMenu();
      break;

    case 'reports':
      await reportMenu();
      break;

    case 'exit':
      process.exit();
  }

  return mainMenu();
}

mainMenu();
