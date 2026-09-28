import { useState, useEffect } from "react";
import { AuthForm, checkInstanceState } from "@features/auth-by-credentials";
import { getInstanceData } from "@entities/instance";
import { Container, Spinner } from "@shared/ui";
import { MainPage } from "@pages/main";

import styles from "./AuthPage.module.scss";

export const AuthPage = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(() => !!getInstanceData());

  useEffect(() => {
    const data = getInstanceData();

    if (data) {
      checkInstanceState(data.idInstance, data.apiTokenInstance)
        .then((res) => {
          if (res.ok) setIsAuth(true);
        })
        .catch((error) => {
          console.error("Ошибка фоновой проверки", error);
        })
        .finally(() => setIsChecking(false));
    }
  }, []);

  if (isChecking) {
    return <Spinner />;
  }

  if (isAuth) {
    return <MainPage />;
  }

  return (
    <section className={styles["authorization"]}>
      <Container>
        <AuthForm onSuccess={() => setIsAuth(true)} />
      </Container>
    </section>
  );
};
