import requests from './httpService';

const SliderServices = {
  getSliders: async () => {
    return requests.get(`/slider-image/list`);
  },
  getSliderById: async (id) => {
    return requests.get(`/slider-image/${id}/get-by-id`);
  },
  addSliders: async (body) => {
    return requests.post('/slider-image/upload', body);
  },
  deleteSlider: async (id) => {
    return requests.get(`/slider-image/${id}/delete`);
  },
  deleteManySliders: async (body) => {
    return requests.post(`/slider-image/multiple-delete`, body);
  },
};

export default SliderServices;
