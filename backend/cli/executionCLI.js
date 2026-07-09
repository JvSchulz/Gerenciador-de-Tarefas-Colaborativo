// cli/executionCLI.js
import { select, input } from '@inquirer/prompts';
import executionService from '../NoRelational/services/executionService.js';

export async function executionMenu() {
  const action = await select({
    message: 'Execução:',
    choices: [
      { name: 'Executar registro', value: 'execute' },
      { name: 'Histórico de execuções', value: 'history' },
      { name: 'Voltar', value: 'back' },
    ],
  });

  switch (action) {
    case 'execute':
      await executeRegisterCLI();
      break;

    case 'history':
      await listExecutionsCLI();
      break;

    case 'back':
      return;
  }

  return executionMenu();
}

async function executeRegisterCLI() {
  const registerId = await input({
    message: 'ID do registro:',
    validate: (v) => v.trim() !== '' || 'Obrigatório',
  });

  try {
    const result = await executionService.executeRegister(registerId);
    console.log(result.message);
  } catch (err) {
    console.log('Erro:', err.message);
  }
}

async function listExecutionsCLI() {
  try {
    const rows = await executionService.getMyExecutionHistory();

    if (rows.length === 0) {
      console.log('Nenhuma execução encontrada.');
      return;
    }

    console.table(
      rows.map((row) => ({
        executadoEm: row.executedAt
          ? new Date(row.executedAt).toISOString().replace('T', ' ').slice(0, 19)
          : '',
        usuario: row.userId?.name ?? '',
        idRegistro: row.registerId?._id?.toString() ?? '',
        tituloRegistro: row.registerId?.title ?? '',
        acao: row.actionType ?? '',
      }))
    );
  } catch (err) {
    console.log('Erro:', err.message);
  }
}
