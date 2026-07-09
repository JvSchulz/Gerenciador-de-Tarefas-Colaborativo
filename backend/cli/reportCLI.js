// cli/reportCLI.js
import { select } from '@inquirer/prompts';
import reportService from '../NoRelational/services/reportService.js';
import registerService from '../NoRelational/services/registerService.js';

export async function reportMenu() {
  const report = await select({
    message: 'Relatórios:',
    choices: [
      { name: 'Visão geral de registros', value: 'status' },
      { name: 'Registros compartilhados comigo', value: 'shared' },
      { name: 'Histórico de execuções', value: 'executions' },
      { name: 'Voltar', value: 'back' },
    ],
  });

  if (report === 'back') {
    return;
  }

  try {
    if (report === 'status') {
      const groups = await reportService.reportCompletedPending();

      console.log('\nConcluídos:');
      if (groups.concluidos.length === 0) {
        console.log('Nenhum registro concluído.');
      } else {
        console.table(
          groups.concluidos.map((item) => ({
            id: item.id,
            titulo: item.titulo,
            categoria: item.categoria,
            prazo: item.prazo,
            criadoEm: item.criadoEm,
          }))
        );
      }

      console.log('\nPendentes:');
      if (groups.pendentes.length === 0) {
        console.log('Nenhum registro pendente.');
      } else {
        console.table(
          groups.pendentes.map((item) => ({
            id: item.id,
            titulo: item.titulo,
            categoria: item.categoria,
            prazo: item.prazo,
            criadoEm: item.criadoEm,
          }))
        );
      }
    }

    if (report === 'shared') {
      const rows = await reportService.reportSharedAndMe();

      if (rows.length === 0) {
        console.log('Nenhum registro compartilhado com você.');
      } else {
        console.table(
          rows.map((row) => ({
            idRegistro: row.idRegistro,
            titulo: row.titulo,
            status: row.status,
            categoria: row.categoria,
            prazo: row.prazo,
            compartilhadoEm: row.compartilhadoEm,
            permissao: row.permissao,
            criador: row.nomeCriador,
            emailCriador: row.emailCriador,
          }))
        );
      }
    }

    if (report === 'executions') {
      const rows = await reportService.reportExecutionHistory();

      if (rows.length === 0) {
        console.log('Nenhuma execução encontrada.');
      } else {
        console.table(
          await Promise.all(
            rows.map(async (row) => {
              const register = await registerService.findRegisterById(
                row.registerId
              );

              return {
                executadoEm: row.executedAt
                  ? new Date(row.executedAt)
                      .toISOString()
                      .replace('T', ' ')
                      .slice(0, 19)
                  : '',
                usuario: row.userId?.name ?? '',
                idRegistro: row.registerId?._id?.toString() ?? '',
                tituloRegistro: register?.title ?? row.registerId?.title ?? '',
                acao: row.actionType ?? '',
              };
            })
          )
        );
      }
    }
  } catch (err) {
    console.log('Erro:', err.message);
  }

  return reportMenu();
}
