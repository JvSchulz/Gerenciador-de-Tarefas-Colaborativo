// services/userService.js
import User from '../models/userModel.js';

const userService = {

  createUser: async (data) => {

    if (!data.name || data.name.trim() === '') {
      throw new Error('Nome é obrigatório.');
    }

    if (!data.email || !data.email.includes('@')) {
      throw new Error('Email inválido.');
    }

    const existing = await User.findByEmail(data.email);

    if (existing) {
      throw new Error('Email já cadastrado.');
    }

    return User.create({
      name: data.name.trim(),
      email: data.email.trim()
    });
  },

  listUsers: async () => {
    return User.findAll();
  },

  updateUser: async (id, data) => {

    if (!id) {
      throw new Error('ID é obrigatório.');
    }

    if (data.email) {
      const existing = await User.findByEmail(data.email);

      if (existing && existing.id !== id) {
        throw new Error('Email já está em uso.');
      }
    }

    const updated = await User.updateUser(id, data);

    if (!updated) {
      throw new Error('Usuário não encontrado.');
    }

    return updated;
  },

  deleteUser: async (id) => {

    if (!id) {
      throw new Error('ID é obrigatório.');
    }

    const deleted = await User.delete(id);

    if (!deleted) {
      throw new Error('Usuário não encontrado.');
    }

    return { message: 'Usuário removido com sucesso.' };
  }

};

export default userService;