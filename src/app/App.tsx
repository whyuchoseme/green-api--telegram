import { Layout } from "./layout";
import { AuthPage } from "@pages/auth";

import "./styles/main.scss";

export const App = () => {
  return (
    <Layout>
      <AuthPage />
    </Layout>
  );
};
