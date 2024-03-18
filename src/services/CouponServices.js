import requests from './httpService';

const CouponServices = {
  addCoupon: async (body) => {
    return requests.post('/coupon-code/save', body);
  },
  addAllCoupon: async (body) => {
    return requests.post('/coupon/add/all', body);
  },
  getAllCoupons: async () => {
    return requests.post('/coupon-code/list');
  },
  getCouponById: async (id) => {
    return requests.get(`/coupon-code/${id}/data`);
  },
  updateCoupon: async (id, body) => {
    return requests.put(`/coupon/${id}`, body);
  },
  updateManyCoupons: async (body) => {
    return requests.patch('/coupon/update/many', body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/coupon/status/${id}`, body);
  },
  deleteCoupon: async (id) => {
    return requests.delete(`/coupon-code/${id}/delete`);
  },
  deleteManyCoupons: async (body) => {
    return requests.post(`/coupon-code/multiple-delete`, body);
  },
};

export default CouponServices;
