import requests from "./httpService";

const CustomerServices = {
  getAllCustomers: async ({ page, limit, body }) => {
    return requests.post(`/customer/list?page=${page}&pageSize=${limit}`,body);
  },
  getSentEmailListByCustomer:async(id,page,limit) => {
    return requests.get(`/${id}/order-status-update?page=${page}&pageSize=${limit}`)
  },
  addAllCustomers: async (body) => {
    return requests.post("/customer/add/all", body);
  },
  // user create
  createCustomer: async (body) => {
    return requests.post(`/customer/create`, body);
  },

  filterCustomer: async (email) => {
    return requests.post(`/customer/filter/${email}`);
  },

  getCustomerById: async (id) => {
    return requests.get(`/${id}/get-customer`);
  },

  updateCustomer: async (id, body) => {
    return requests.post(`/user/update`, body);
  },

  deleteCustomer: async (id) => {
    return requests.get(`/user/${id}/delete`);
  },
};

export default CustomerServices;
