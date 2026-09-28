import { API_URL } from "@shared/api";

export const checkInstanceState = async (id: string, token: string) => {
  return await fetch(
    API_URL + "/waInstance" + id + "/getStateInstance/" + token,
  );
};
