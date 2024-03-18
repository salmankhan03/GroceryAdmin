import requests from "./httpService";

const PermissionServices = {
  addPermission: async (body) => {
    return requests.post("/permission/save", body);
  },

  // updatepPermission: async (id, body) => {
  //   return requests.put(`/admin/${id}`, body);
  // },

  getAllPermission: async (body) => {
    return requests.get("/permission/list", body);
  },

  getPermissionById: async (id) => {
    return requests.get(`/permission/${id}/data`);
  },

  deletePermission: async (id, body) => {
    return requests.get(`/permission/${id}/delete`, body);
  },



};

export default PermissionServices;
