import Register from '../models/registerModel.js';
import Sharing from '../models/sharingModel.js';
import Execution from '../models/executionModel.js';
import { getCurrentUserId } from './currentUser.js';

function asObjectId(value) {
  if (typeof value === 'string') {
    return value.trim() === '' ? undefined : value.trim();
  }

  return value;
}

const registerService = {
  async createRegister(data) {
    const currentUserId = getCurrentUserId();

    if (!data.title || data.title.trim() === '') {
      throw new Error('Título é obrigatório.');
    }

    const register = await Register.create({
      title: data.title.trim(),
      description: data.description || '',
      dueDate: data.dueDate || undefined,
      status: 'pendente',
      userId: currentUserId,
      creatorId: currentUserId,
      categoryId: asObjectId(data.categoryId) || undefined,
    });

    return register;
  },

  async getMyRegisters() {
    const currentUserId = getCurrentUserId();

    return Register.find({ creatorId: currentUserId })
      .sort({ createdAt: -1 })
      .populate('categoryId', 'name');
  },

  async findRegisterById(id) {
    return Register.findById(id).populate('categoryId', 'name');
  },

  async isOwner(registerId) {
    if (!registerId) return false;

    const currentUserId = getCurrentUserId();

    const register = await Register.findOne({
      _id: registerId,
      creatorId: currentUserId,
    }).select('_id');

    return !!register;
  },

  async isEditor(registerId) {
    if (!registerId) return false;

    const currentUserId = getCurrentUserId();

    const sharing = await Sharing.findOne({
      registerId,
      userId: currentUserId,
      permission: 'write',
    }).select('_id');

    return !!sharing;
  },

  async updateRegister(registerId, data) {
    if (!registerId) {
      throw new Error('ID do registro é obrigatório.');
    }

    const isOwner = await this.isOwner(registerId);

    if (!isOwner) {
      throw new Error('Você não pode atualizar este registro.');
    }

    const update = {};

    if (typeof data.title === 'string' && data.title.trim() !== '') {
      update.title = data.title.trim();
    }

    if (typeof data.description === 'string') {
      update.description = data.description.trim();
    }

    if (data.status) {
      update.status = data.status;
    }

    if (data.dueDate !== undefined) {
      update.dueDate = data.dueDate || undefined;
    }

    if (Object.keys(update).length === 0) {
      throw new Error('Nada para atualizar.');
    }

    if (typeof data.categoryId !== 'undefined') {
      update.categoryId = data.categoryId || undefined;
    }

    const updated = await Register.findByIdAndUpdate(registerId, update, {
      new: true,
    }).populate('categoryId', 'name');

    if (!updated) {
      throw new Error('Registro não encontrado.');
    }

    return updated;
  },

  async deleteRegister(registerId) {
    if (!registerId) {
      throw new Error('ID do registro é obrigatório.');
    }

    const isOwner = await this.isOwner(registerId);

    if (!isOwner) {
      throw new Error('Você não pode remover este registro.');
    }

    const deleted = await Register.findByIdAndDelete(registerId);

    if (!deleted) {
      throw new Error('Registro não encontrado.');
    }

    return { message: 'Registro removido com sucesso.' };
  },

  async findRegisterByTitle(title) {
    if (!title) return null;

    const currentUserId = getCurrentUserId();

    return Register.findOne({
      title: title.trim(),
      creatorId: currentUserId,
    });
  },

  async updateRegisterByTitle(title, data) {
    if (!title) {
      throw new Error('Título do registro é obrigatório.');
    }

    const currentUserId = getCurrentUserId();

    const register = await Register.findOne({
      title: title.trim(),
      creatorId: currentUserId,
    });

    if (!register) {
      throw new Error('Registro não encontrado.');
    }

    return this.updateRegister(register._id.toString(), data);
  },

  async deleteRegisterByTitle(title) {
    if (!title) {
      throw new Error('Título do registro é obrigatório.');
    }

    const currentUserId = getCurrentUserId();

    const register = await Register.findOne({
      title: title.trim(),
      creatorId: currentUserId,
    });

    if (!register) {
      throw new Error('Registro não encontrado.');
    }

    return this.deleteRegister(register._id.toString());
  },
};

export default registerService;
