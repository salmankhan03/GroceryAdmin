import requests from "./httpService";

const ProductServices = {
  getAllProducts: async ({ page, limit, category, title, price }) => {
let obj = {};
let quantity;

if (price === "low" || price === "high") {
  obj.sort = { price: price === "low" ? "asc" : "desc" };
} else if (price === "date-added-asc" || price === "date-added-desc") {
  obj.sort = { created_at: price === "date-added-asc" ? "asc" : "desc" };
} else {
  obj = {};
  quantity =price ? price === "status-selling" ? "1" : "-1" :'';
}

const searchCategory = category !== null ? category : "";
const searchTitle = title !== null ? title : "";
const body = {
  category: searchCategory,
  title: searchTitle,
  ...(Object.keys(obj).length !== 0 && { sort: obj.sort }),
  ...(quantity && { quantity })
};

console.log(body);

    return requests.post(
      `/product/list?page=${page}&pageSize=${limit}`,body
    );
  },

  getProductById: async (id) => {
    return requests.get(`/product/${id}/data`);
  },
  addProduct: async (body) => {
    return requests.post("/product/save", body);
  },
  addAllProducts: async (body) => {
    return requests.post("/products/all", body);
  },
  updateProduct: async (id, body) => {
    return requests.post("/product/save", body);
  },
  updateManyProducts: async (body) => {
    return requests.patch("products/update/many", body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/products/status/${id}`, body);
  },

  deleteProduct: async (id,body) => {
    return requests.delete(`/product/${id}/delete`, body);
  },
  deleteManyProducts: async (body) => {
    return requests.post("/product/multiple-delete", body);
  },
};

export default ProductServices;
