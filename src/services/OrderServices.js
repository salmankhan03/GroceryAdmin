import requests from "./httpService";

const OrderServices = {
  getAllOrders: async ({
    body,
    headers,
    customerName,
    status,
    page = 1,
    limit = 8,
    day,
    startDate,
    endDate,
  }) => {
    const searchName = customerName !== null ? customerName : "";
    const searchStatus = status !== null ? status : "";
    const searchDay = day !== null ? day : "";
    const startD = startDate !== null ? startDate : "";
    const endD = endDate !== null ? endDate : "";

    body ={
      customerName:searchName,
      status:searchStatus,
      day:searchDay,
      startDate:startD,
      endDate:endD,
      method:""

    }
    console.log(body)
    return requests.post(
      `/order/list?page=${page}&pageSize=${limit}`,body);

    // return requests.get(
    //   `/orders?customerName=${searchName}&status=${searchStatus}&day=${searchDay}&page=${page}&limit=${limit}&startDate=${startD}&endDate=${endD}`,
    //   body,
    //   headers
    // );
  },

  getAllOrderList: async ({ page, limit }) => {
    return requests.post(
      `/order/list?page=${page}&pageSize=${limit}`);
  },
  getAllOrdersTwo: async ({ invoice, body, headers }) => {
    const searchInvoice = invoice !== null ? invoice : "";
    return requests.get(`/orders/all?invoice=${searchInvoice}`, body, headers);
  },

  getRecentOrders: async ({
    page = 1,
    limit = 8,
    startDate = "1:00",
    endDate = "23:59",
  }) => {
    return requests.get(
      `/orders/recent?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    );
  },

  getOrderCustomer: async (id, body) => {
    return requests.get(`/user/${id}/orders`, body);
  },

  getOrderById: async (id) => {
    return requests.get(`/order/${id}/data`);
  },

  updateOrder: async (body) => {
    return requests.post(`/order/update-status`, body);
  },

  deleteOrder: async (id) => {
    return requests.delete(`/orders/${id}`);
  },

  getDashboardOrdersData: async ({
    page = 1,
    limit = 8,
    endDate = "23:59",
  }) => {
    return requests.get(
      `/orders/dashboard?page=${page}&limit=${limit}&endDate=${endDate}`
    );
  },

  getDashboardAmount: async () => {
    return requests.get("/orders/dashboard-amount");
  },

  getDashboardCount: async () => {
    return requests.get("/orders/dashboard-count");
  },

  getDashboardRecentOrder: async ({ page = 1, limit = 8 }) => {
    return requests.get(
      `/orders/dashboard-recent-order?page=${page}&limit=${limit}`
    );
  },

  getBestSellerProductChart: async () => {
    return requests.get("/orders/best-seller/chart");
  },
};

export default OrderServices;
