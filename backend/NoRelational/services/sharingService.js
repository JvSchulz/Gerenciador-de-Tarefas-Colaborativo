import Register from '../models/registerModel.js';
import Sharing from '../models/sharingModel.js';
import User from '../models/userModel.js';
import { getCurrentUserId } from './currentUser.js';

const sharingService = {
  async shareRegister(registerId, targetUserId, permission) {
    if (!registerId) {
      throw new Error('ID do registro é obrigatório.');
    }

    if (!targetUserId) {
      throw new Error('Usuário destino é obrigatório.');
    }

    if (!['read', 'write'].includes(permission)) {
      throw new Error('Permissão inválida.');
    }

    const currentUserId = getCurrentUserId();

    const register = await Register.findById(registerId);

    if (!register) {
      throw new Error('Registro não encontrado.');
    }

    if (register.creatorId.toString() !== currentUserId) {
      throw new Error('Você não pode compartilhar este registro.');
    }

    if (register.creatorId.toString() === targetUserId) {
      throw new Error("Não é possível compartilhar com você mesmo.");
    }

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      throw new Error('Usuário destino não encontrado.');
    }

    const alreadyExists = await Sharing.findOne({
      userId: targetUserId,
      registerId,
    });

    if (alreadyExists) {
      throw new Error('Registro já compartilhado com esse usuário.');
    }

    const sharing = await Sharing.create({
      userId: targetUserId,
      registerId,
      permission,
    });

    return sharing;
  },

  async getSharedWithMe() {
    const currentUserId = getCurrentUserId();

    return Sharing.find({ userId: currentUserId })
      .sort({ sharedAt: -1 })
      .populate('registerId', 'title status dueDate createdAt creatorId')
      .populate('registerId.creatorId', 'name')
      .populate('registerId.categoryId', 'name');
  },

  async getMySharedRegistersWithUsers() {
    const currentUserId = getCurrentUserId();

    const owned = await Register.find({ creatorId: currentUserId }).distinct('_id');

    if (owned.length === 0) {
      return [];
    }

    return Sharing.find({ registerId: { $in: owned } })
      .populate('registerId', 'title status')
      .populate('userId', 'name email');
  },

  async removeSharing(registerId) {
    if (!registerId) {
      throw new Error('ID do registro é obrigatório.');
    }

    const currentUserId = getCurrentUserId();

    const register = await Register.findById(registerId);

    if (!register) {
      throw new Error('Registro não encontrado.');
    }

    if (register.creatorId.toString() !== currentUserId) {
      throw new Error('Você não pode remover este compartilhamento.');
    }

    const deleted = await Sharing.findOneAndDelete({
      registerId,
    });

    if (!deleted) {
      throw new Error('Compartilhamento não encontrado.');
    }

    return { message: 'Compartilhamento removido.' };
  },
};

export default sharingService;
