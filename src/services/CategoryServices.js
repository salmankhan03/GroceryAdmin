import requests from "./httpService";

const CategoryServices = {
  getAllCategory: async () => {
    return requests.get("/category/list?page=1&pageSize=200");
  },

  getAllCategories: async () => {
    return requests.post("/category/tree?page=1&pageSize=200");
  },

  getCategoryById: async (id) => {
    return requests.get(`/category/${id}/category-data`);
  },

  addCategory: async (body) => {
    console.log("body add cat",body)
    return requests.post("/category/save", body);
  },

  addAllCategory: async (body) => {
    return requests.post("/category/add/all", body);
  },

  updateCategory: async (id, body) => {
    return requests.post("/category/save", body);
  },

  updateStatus: async (id, body) => {
    return requests.post("/category/save", body);
  },

  deleteCategory: async (id, body) => {
    return requests.delete(`/category/${id}/delete`, body);
  },

  updateManyCategory: async (body) => {
    return requests.patch("/category/update/many", body);
  },

  deleteManyCategory: async (body) => {
    return requests.post("/category/multiple-delete", body);
  },
};

export default CategoryServices;
