import client from "./client";

export const getReminders = (vehicleId) => {
  const params = vehicleId ? { vehicle: vehicleId } : {};
  return client.get("/maintenance/reminders/", { params });
};
export const createReminder = (data) =>
  client.post("/maintenance/reminders/", data);
export const updateReminder = (id, data) =>
  client.patch(`/maintenance/reminders/${id}/`, data);

export const getLogs = (vehicleId) => {
  const params = vehicleId ? { vehicle: vehicleId } : {};
  return client.get("/maintenance/logs/", { params });
};
export const createLog = (data) => client.post("/maintenance/logs/", data);
