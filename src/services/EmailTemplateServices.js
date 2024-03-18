import requests from "./httpService";
const EmailTemplateServices = {
  getAllTemplates: async (data)=> {
    console.log("GET ALL TEMPLATES CALL")
    return requests.get(`/email-template/list?page=${data.page}&pageSize=${data.limit}`);
  },
  getTemplatesById: async (id) => {
    return requests.get(`/email-template/${id}/data`);
  },
  addUpdateEmailTemplates: async (body) => {
    return requests.post("/email-template/save", body);
  },
  
  deleteTemplates: async (id,body) => {
    return requests.delete(`/email-template/${id}/delete`, body);
  },
  deleteManyTemplates: async (body) => {
    return requests.post("/email-template/multiple-delete", body);
  },

};
export default EmailTemplateServices;
