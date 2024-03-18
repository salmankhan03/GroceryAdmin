import requests from "./httpService";

const SettingServices = {
  // global setting all function
  addGlobalSetting: async (body) => {
    // return requests.post("/setting/global/add", body);
  },

  getGlobalSetting: async () => {
    // return requests.get("/setting/global/all");
  },

  updateGlobalSetting: async (body) => {
    // return requests.put(`/setting/global/update`, body);
  },
    // multidelete Media
  removeMultiDeleteMedia: async (body) => {
    // return requests.post("/image/multiple-delete", body);
  },
};

export default SettingServices;
