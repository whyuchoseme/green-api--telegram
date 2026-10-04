import { Button, Input } from "@shared/ui";
import { useAuth } from "../model/use-auth";

import styles from "./AuthForm.module.scss";

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { credentials, dispatch, isLoading, authError, handleLogin } =
    useAuth(onSuccess);

  return (
    <form className={styles["authorization-form"]} onSubmit={handleLogin}>
      <h2 className={styles["authorization-form__title"]}>GREEN-API</h2>

      <Input
        id="authorization-id"
        className={styles["authorization-form__id"]}
        type="text"
        inputMode="numeric"
        placeholder="idInstance"
        value={credentials.id}
        onChange={(e) =>
          dispatch({ type: "setIdInstance", payload: e.target.value })
        }
        required
      />

      <Input
        id="authorization-token"
        className={styles["authorization-form__token"]}
        type="password"
        placeholder="apiTokenInstance"
        value={credentials.token}
        onChange={(e) =>
          dispatch({ type: "setApiTokenInstance", payload: e.target.value })
        }
        required
      />

      {authError && (
        <div className={styles["authorization-form__error"]}>{authError}</div>
      )}

      <div className={styles["authorization-form__actions"]}>
        <Button viewVariant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Проверка..." : "Войти"}
        </Button>
        {!(
          isLoading ||
          (credentials.id === "" && credentials.token === "")
        ) && (
          <Button
            viewVariant="primary"
            disabled={isLoading}
            onClick={() => dispatch({ type: "reset" })}
          >
            Сбросить
          </Button>
        )}
      </div>
    </form>
  );
};
