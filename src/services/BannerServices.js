import requests from './httpService';

const BannerServices = {
  getBanners: async () => {
    return requests.get(`/banner/list`);
  },
  getBannersById: async (id) => {
    return requests.get(`/banner/${id}/get-by-id`);
  },
  addBanners: async (body) => {
    return requests.post('/banner/upload', body);
  },
  deleteBanner: async (id) => {
    return requests.get(`/banner/${id}/delete`);
  },
  deleteManyBanner: async (body) => {
    return requests.post(`/banner/multiple-delete`, body);
  },
};

export default BannerServices;
