import Register from '../models/registerModel.js';
import Sharing from '../models/sharingModel.js';
import Execution from '../models/executionModel.js';
import { getCurrentUserId } from './currentUser.js';

const executionService = {
  async executeRegister(registerTitle) {
    const currentUserId = getCurrentUserId();

    const register = await Register.findOne({ title: registerTitle.trim() });

    if (!register) {
      throw new Error('Registro não encontrado.');
    }

    const isOwner = register.creatorId.toString() === currentUserId;
    const shared = await Sharing.findOne({
      registerId: register._id,
      userId: currentUserId,
    });

    if (!isOwner && !shared) {
      throw new Error('Você não tem permissão para executar este registro.');
    }

    const newStatus = register.status === 'pendente' ? 'concluido' : 'pendente';

    const updated = await Register.findByIdAndUpdate(
      register._id,
      { status: newStatus },
      { new: true }
    );

    await Execution.create({
      userId: currentUserId,
      registerId: register._id,
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
