// src/services/api.js
export const api = {
  login: async (email, senha) => {
    // simula atraso
    await new Promise(res => setTimeout(res, 500));
    if (email === "admin@ex.com" && senha === "123456") {
      return { success: true, token: "fake-token", user: { name: "Thiago" } };
    }
    return { success: false, error: "Credenciais inválidas" };
  },
  getSalas: async () => {
    await new Promise(res => setTimeout(res, 300));
    return [
      { id: 1, nome: "Laboratório 1" },
      { id: 2, nome: "Laboratório 2" },
      { id: 3, nome: "Sala 103" },
    ];
  },
  reservarSala: async ({ salaId, data, inicio, fim }) => {
    await new Promise(res => setTimeout(res, 300));
    return { success: true, reservaId: Math.floor(Math.random()*1000) };
  },
  cadastrarUsuario: async (user) => {
    await new Promise(res => setTimeout(res, 300));
    return { success: true, id: Math.floor(Math.random()*1000) };
  },
  cadastrarSala: async (sala) => {
    await new Promise(res => setTimeout(res, 300));
    return { success: true, id: Math.floor(Math.random()*1000) };
  }
};
