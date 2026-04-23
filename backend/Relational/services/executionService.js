import registerModel from "../models/registerModel.js";
import sharingModel from "../models/sharingModel.js";
import executionModel from "../models/executionModel.js";

export default {
  async executeRegister(userId, registerId) {
    const isOwner = await registerModel.isOwner(registerId);
    const isShared = await sharingModel.exists(userId, registerId);

    if (!isOwner && !isShared) {
      throw new Error("Você não tem permissão para executar este registro.");
    }

    const register = await registerModel.findById(registerId);

    if (!register) {
      throw new Error("Registro não encontrado.");
    }

    const newStatus = {
      status: register.status === "pendente" ? "concluido" : "pendente",
    };

    await registerModel.updateRegister(registerId, newStatus);

    await executionModel.create({
      user_id: userId,
      register_id: registerId,
      action_type: "update",
      executed_at: new Date(),
    });

    return {
      message: `Registro atualizado para ${newStatus.status}`,
    };
  },

  async getMyExecutionHistory(userId) {
    return executionModel.findExecutionHistory(userId);
  },
};
