// services/registerService.js
import Register from "../models/registerModel.js";

const registerService = {
  createRegister: async (data) => {
    if (!data.title || data.title.trim() === "") {
      throw new Error("Título é obrigatório.");
    }

    const newRegister = await Register.create({
      title: data.title.trim(),
      description: data.description || "",
      category_id: data.category_id || null,
      creator_id: 1,
      status: "pendente",
      due_date: data.due_date || null
    });

    return newRegister;
  },

  getMyRegisters: async () => {
    const registers = await Register.findMyRegisters();

    return registers;
  },

  updateRegister: async (registerId, data) => {
    if (!registerId) {
      throw new Error("ID do registro é obrigatório.");
    }

    const isOwner = await Register.isOwner(registerId);

    if (!isOwner) {
      throw new Error("Você não pode editar este registro.");
    }

    const updated = await Register.updateRegister(registerId, data);

    if (!updated) {
      throw new Error("Registro não encontrado.");
    }

    return updated;
  },

  deleteRegister: async (registerId) => {
    if (!registerId) {
      throw new Error("ID do registro é obrigatório.");
    }

    const isOwner = await Register.isOwner(registerId);

    if (!isOwner) {
      throw new Error("Você não pode deletar este registro.");
    }

    const deleted = await Register.delete(registerId);

    if (!deleted) {
      throw new Error("Registro não encontrado.");
    }

    return { message: "Registro removido com sucesso." };
  },
};

export default registerService;
