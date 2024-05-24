import requests from './httpService';

const AttributeServices = {
  getAllAttributes: async () => {
    return requests.post(`/product-attribute/list`);
  },

  getShowingAttributes: async (body) => {
    return requests.post('/product-attribute/list');
  },

  addAttribute: async (body) => {
    return requests.post('/product-attribute/upsert', body);
  },
  updateAttributes: async (body) => {
    return requests.post('/product-attribute/upsert', body);
  },

  addChildAttribute: async (body) => {
    return requests.post(`/product-attribute-value/upsert`, body);
  },

  addAllAttributes: async (body) => {
    return requests.post('/attributes/add/all', body);
  },

  getAttributeById: async (id) => {
    return requests.get(`/product-attribute/${id}/get-by-id`);
  },
  getAttributeIdByOptions: async (id) => {
    return requests.get(`/product-attribute/${id}/values`);
  },
  getChildAttributeById: async (ids) => {
    return requests.get(`/product-attribute-value/${ids}/get-by-id`);
  },
  updateChildAttributes: async ({ id, ids }, body) => {
    return requests.put(`/attributes/update/child/${ids}/${id}`, body);
  },

  updateStatus: async (id, body) => {
    return requests.put(`/attributes/status/${id}`, body);
  },

  updateChildStatus: async (id, body) => {
    return requests.put(`/attributes/status/child/${id}`, body);
  },

  deleteAttribute: async (id, body) => {
    return requests.get(`/product-attribute/${id}/delete`, body);
  },

  deleteChildAttribute: async (id) => {
    return requests.get(`/product-attribute-value/${id}/delete`);
  },

  updateManyAttribute: async (body) => {
    return requests.patch('/attributes/update/many', body);
  },

  updateManyChildAttribute: async (body) => {
    return requests.patch('/attributes/update/child/many', body);
  },

  deleteManyAttribute: async (body) => {
    return requests.post('/product-attribute/multiple-delete', body);
  },

  deleteManyChildAttribute: async (body) => {
    return requests.post('/product-attribute-value/multiple-delete', body);
  },
};

export default AttributeServices;
