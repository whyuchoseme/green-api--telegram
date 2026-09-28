import { useReducer, useState } from "react";
import { checkInstanceState } from "../api/check-instance";
import { saveInstanceData } from "@entities/instance";

type AuthAction =
  | { type: "setIdInstance"; payload: string }
  | { type: "setApiTokenInstance"; payload: string }
  | { type: "reset" };

const reducer = (state: { id: string; token: string }, action: AuthAction) => {
  switch (action.type) {
    case "setIdInstance":
      return { ...state, id: action.payload };
    case "setApiTokenInstance":
      return { ...state, token: action.payload };
    case "reset":
      return { id: "", token: "" };
    default:
      return state;
  }
};

export const useAuth = (onSuccess: () => void) => {
  const [credentials, dispatch] = useReducer(reducer, { id: "", token: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!credentials.id || !credentials.token) return;

    setIsLoading(true);
    setAuthError("");

    try {
      const response = await checkInstanceState(
        credentials.id,
        credentials.token,
      );

      if (response.ok) {
        saveInstanceData(credentials.id, credentials.token);
        onSuccess();
      } else {
        setAuthError("Некорректные idInstance или apiTokenInstance");
      }
    } catch (error) {
      console.error("Ошибка проверки авторизации:", error);
      setAuthError("Ошибка сети при проверке данных");
    } finally {
      setIsLoading(false);
    }
  };

  return { credentials, dispatch, isLoading, authError, handleLogin };
};
