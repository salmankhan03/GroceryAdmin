import requests from "./httpService";
const StaticPageServices = {
  getAllTemplates: async (data)=> {
    return requests.get(`/template/list?page=${data.page}&pageSize=${data.limit}`);
  },
  getTemplatesById: async (id) => {
    return requests.get(`/template/${id}/data`);
  },
  addUpdateTemplates: async (body) => {
    return requests.post("/template/save", body);
  },
  
  deleteTemplates: async (id,body) => {
    return requests.delete(`/template/${id}/delete`, body);
  },
  deleteManyTemplates: async (body) => {
    return requests.post("/template/multiple-delete", body);
  },

};
export default StaticPageServices;
