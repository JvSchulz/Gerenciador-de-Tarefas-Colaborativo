import Register from '../models/registerModel.js';
import Sharing from '../models/sharingModel.js';
import Execution from '../models/executionModel.js';
import { getCurrentUserId } from './currentUser.js';

const executionService = {
  async executeRegister(registerId) {
    const currentUserId = getCurrentUserId();

    const register = await Register.findById(registerId);

    if (!register) {
      throw new Error('Registro não encontrado.');
    }

    const isOwner = register.creatorId.toString() === currentUserId;
    const shared = await Sharing.findOne({
      registerId,
      userId: currentUserId,
    });

    if (!isOwner && !shared) {
      throw new Error('Você não tem permissão para executar este registro.');
    }

    const newStatus = register.status === 'pendente' ? 'concluido' : 'pendente';

    const updated = await Register.findByIdAndUpdate(
      registerId,
      { status: newStatus },
      { new: true }
    );

    await Execution.create({
      userId: currentUserId,
      registerId,
      actionType: 'update',
    });

    return {
      message: `Registro atualizado para ${newStatus}`,
      register: updated,
    };
  },

  async getMyExecutionHistory() {
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

export default executionService;
