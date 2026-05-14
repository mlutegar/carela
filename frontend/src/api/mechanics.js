import client from "./client";

export const getMechanics = (params = {}) =>
  client.get("/mechanics/", { params });
export const getMechanic = (id) => client.get(`/mechanics/${id}/`);
export const addReview = (mechanicId, data) =>
  client.post(`/mechanics/${mechanicId}/reviews/`, data);
