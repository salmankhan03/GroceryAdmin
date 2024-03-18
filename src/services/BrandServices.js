import requests from "./httpService";
const BrandServices = {
  getAllBrands: async (data)=> {
    return requests.post(`/product-brand/list?page=${data.page}&pageSize=${data.limit}`);
  },
  getBrandById: async (id) => {
    return requests.get(`/product-brand/${id}/data`);
  },
  addUpdateBrand: async (body) => {
    return requests.post("/product-brand/save", body);
  },
  
  deleteBrands: async (id,body) => {
    return requests.delete(`/product-brand/${id}/delete`, body);
  },
  deleteManyBrands: async (body) => {
    return requests.post("/product-brand/multiple-delete", body);
  },

};
export default BrandServices;
