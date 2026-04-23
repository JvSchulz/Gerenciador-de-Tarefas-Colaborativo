import Sharing from "../models/sharingModel.js";
import Register from "../models/registerModel.js";

const sharingService = {
  shareRegister: async (registerId, targetUserId, permission) => {
    if (!registerId) {
      throw new Error("ID do registro é obrigatório.");
    }

    if (!targetUserId) {
      throw new Error("Usuário destino é obrigatório.");
    }

    if (!["read", "write"].includes(permission)) {
      throw new Error("Permissão inválida.");
    }

    const isOwner = await Register.isOwner(registerId);

    if (!isOwner) {
      throw new Error("Você não pode compartilhar este registro.");
    }

    const alreadyExists = await Sharing.exists(targetUserId, registerId);

    if (alreadyExists) {
      throw new Error("Registro já compartilhado com esse usuário.");
    }
    return Sharing.create({
      user_id: targetUserId,
      register_id: registerId,
      permission,
    });
  },

  getSharedWithMe: async () => {
    return Sharing.findSharedWithMe();
  },

  getMySharedRegistersWithUsers: async () => {
    return Sharing.findMySharedRegistersWithUsers();
  },

  removeSharing: async (registerId) => {
    if (!registerId) {
      throw new Error("Dados inválidos.");
    }

    const isOwner = await Register.isOwner(registerId);

    if (!isOwner) {
      throw new Error("Você não pode remover este compartilhamento.");
    }

    const removed = await Sharing.removeShare(registerId);

    if (!removed) {
      throw new Error("Compartilhamento não encontrado.");
    }

    return { message: "Compartilhamento removido." };
  },
};

export default sharingService;
