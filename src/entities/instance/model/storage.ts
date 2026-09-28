import type { InstanceCredentials } from "./types";

export const getInstanceData = (): InstanceCredentials | null => {
  const id = localStorage.getItem("idInstance");
  const token = localStorage.getItem("apiTokenInstance");

  if (id && token) {
    return { idInstance: id, apiTokenInstance: token };
  }
  return null;
};

export const saveInstanceData = (id: string, token: string) => {
  localStorage.setItem("idInstance", id);
  localStorage.setItem("apiTokenInstance", token);
};

export const clearInstanceData = () => {
  localStorage.removeItem("idInstance");
  localStorage.removeItem("apiTokenInstance");
};
