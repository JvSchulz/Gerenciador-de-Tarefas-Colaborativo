import User from '../models/userModel.js';

const userService = {
  async createUser(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Nome é obrigatório.');
    }

    const normalizedEmail = (data.email || '').trim().toLowerCase();

    if (normalizedEmail !== '') {
      const existing = await User.findOne({ email: normalizedEmail });

      if (existing) {
        throw new Error('Email já cadastrado.');
      }
    }

    return User.create({
      name: data.name.trim(),
      email: normalizedEmail || undefined,
    });
  },

  async listUsers() {
    return User.find().sort({ createdAt: 1 });
  },

  async findUserByName(name) {
    if (!name) return null;

    return User.findOne({ name: name.trim() });
  },

  async findUserByEmail(email) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) return null;

    return User.findOne({ email: normalizedEmail });
  },

  async updateUserByName(name, data) {
    const user = await User.findOne({ name: name.trim() });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const update = {};

    if (typeof data.name === 'string' && data.name.trim() !== '') {
      update.name = data.name.trim();
    }

    if (typeof data.email === 'string') {
      const normalizedEmail = data.email.trim().toLowerCase();

      if (normalizedEmail !== '') {
        const existing = await User.findOne({
          email: normalizedEmail,
          _id: { $ne: user._id },
        });

        if (existing) {
          throw new Error('Email já está em uso.');
        }

        update.email = normalizedEmail;
      }
    }

    if (Object.keys(update).length === 0) {
      throw new Error('Nada para atualizar.');
    }

    return User.findByIdAndUpdate(user._id, update, { new: true });
  },

  async deleteUserByName(name) {
    const user = await User.findOne({ name: name.trim() });

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    await User.findByIdAndDelete(user._id);

    return { message: 'Usuário removido com sucesso.' };
  },
};

export default userService;
