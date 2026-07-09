import Register from '../models/registerModel.js';
import Sharing from '../models/sharingModel.js';
import Execution from '../models/executionModel.js';
import Category from '../models/categoryModel.js';
import User from '../models/userModel.js';
import { getCurrentUserId } from './currentUser.js';

const reportService = {
  async reportCompletedPending() {
    const currentUserId = getCurrentUserId();

    const registers = await Register.find({ creatorId: currentUserId })
      .populate('categoryId', 'name')
      .sort({ status: 1, createdAt: -1 });

    const groups = {
      concluidos: [],
      pendentes: [],
    };

    for (const register of registers) {
      const item = {
        id: register._id.toString(),
        titulo: register.title,
        status: register.status,
        categoria: register.categoryId?.name || 'Sem categoria',
        prazo: register.dueDate,
        criadoEm: register.createdAt,
      };

      if (register.status === 'concluido') {
        groups.concluidos.push(item);
      } else {
        groups.pendentes.push(item);
      }
    }

    return groups;
  },

  async reportSharedAndMe() {
    const currentUserId = getCurrentUserId();

    const results = await Sharing.find({ userId: currentUserId })
      .populate('registerId', 'title status description dueDate createdAt')
      .populate('registerId.creatorId', 'name email')
      .populate('registerId.categoryId', 'name')
      .sort({ sharedAt: -1 });

    return results.map((item) => ({
      compartilhadoEm: item.sharedAt,
      permissao: item.permission,
      idRegistro: item.registerId._id.toString(),
      titulo: item.registerId.title,
      status: item.registerId.status,
      prazo: item.registerId.dueDate,
      categoria: item.registerId.categoryId?.name || '',
      nomeCriador: item.registerId.creatorId?.name || '',
      emailCriador: item.registerId.creatorId?.email || '',
    }));
  },

  async reportExecutionHistory() {
    const currentUserId = getCurrentUserId();

    const owned = Register.find({ creatorId: currentUserId }).distinct('_id');
    const shared = Sharing.find({ userId: currentUserId }).distinct('registerId');

    const [ownerIds, sharedIds] = await Promise.all([owned, shared]);

    const allowedRegisterIds = [...new Set([...ownerIds, ...sharedIds])];

    if (allowedRegisterIds.length === 0) {
      return [];
    }

    return Execution.find({ registerId: { $in: allowedRegisterIds } })
      .sort({ executedAt: -1 })
      .populate('userId', 'name')
      .populate('registerId', 'title');
  },
};

export default reportService;
