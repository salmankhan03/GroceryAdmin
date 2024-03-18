import requests from "./httpService";

const RoleServices = {
  addRole: async (body) => {
    return requests.post("/role/save", body);
  },

  updateRole: async (id, body) => {
    return requests.put(`/admin/${id}`, body);
  },

  getAllRole: async (body) => {
    return requests.get("/role/list", body);
  },

  getRoleById: async (id) => {
    return requests.get(`/role/${id}/data`);
  },

  deleteRole: async (id, body) => {
    return requests.get(`/role/${id}/delete`, body);
  },



};

export default RoleServices;
