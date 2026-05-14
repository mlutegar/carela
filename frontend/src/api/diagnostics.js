import client from "./client";

export const getDiagnostics = () => client.get("/diagnostics/");
export const getDiagnostic = (id) => client.get(`/diagnostics/${id}/`);
export const createDiagnostic = (formData) =>
  client.post("/diagnostics/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
