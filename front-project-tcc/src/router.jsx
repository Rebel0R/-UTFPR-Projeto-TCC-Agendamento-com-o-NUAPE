import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Account from "./pages/account/account_index/Account";
import Error from "./pages/error/Error";
import React, { Suspense } from "react";
import api from "./api";
import Scheduling from "./pages/scheduling/Scheduling";
import RootLayout from "./pages/RootLayout";
import { decodeToken } from "react-jwt";
import AccountLayout from "./pages/account/AccountLayout";
import Loading from "./components/loading/Loading";
import Sidebar from "./components/sidebar/Sidebar";
import AccountManualScheduling from "./pages/account/account_manual_scheduling/AccountManualScheduling";
import { toast } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "scheduling", element: <Scheduling /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/account/:id",
    errorElement: <Error />,
    element: (
      <Suspense
        fallback={
          <div>
            <Sidebar
              abbrevUserName="NaN"
              userName="Nome do usuário"
              userArea="Area"
            />
          </div>
        }
      >
        <AccountLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div>
                <Loading />
              </div>
            }
          >
            <Account />
          </Suspense>
        ),
        loader: async ({ params }) => {
          const token = localStorage.getItem("token");
          const decodedToken = decodeToken(token);
          if (!token || !decodedToken) {
            throw new Error("Token inválido ou não encontrado");
          }
          const tokenIssuedAt = decodedToken.iat;
          const expirationDurationInSeconds = 2 * 60 * 60;

          const currentTimeInSeconds = Date.now() / 1000;
          const tokenExpirationTime =
            tokenIssuedAt + expirationDurationInSeconds;
          if (currentTimeInSeconds >= tokenExpirationTime) {
            alert("Parece que sua sessão expirou");
            localStorage.removeItem("token");
            throw new Error("Parece que o token expirou");
          }
          try {
            const response = await api.get(`account/${params.id}`, {
              headers: { Authorization: token },
            });

            return response.data;
          } catch (error) {
            toast.error(error.response.data.error);
            throw error;
          }
        },
      },
      {
        path: "manual-scheduling",
        element: <AccountManualScheduling />,
        loader: async ({ params }) => {
          const token = localStorage.getItem("token");
          const decodedToken = decodeToken(token);
          if (!token) {
            throw new Error("Token não encontrado");
          }
          const tokenIssuedAt = decodedToken.iat;
          const expirationDurationInSeconds = 2 * 60 * 60;

          const currentTimeInSeconds = Date.now() / 1000;
          const tokenExpirationTime =
            tokenIssuedAt + expirationDurationInSeconds;
          if (currentTimeInSeconds >= tokenExpirationTime) {
            localStorage.removeItem("token");
            throw new Error("Parece que o token expirou");
          }
          try {
            const response = await api.get(`account/${params.id}`, {
              headers: { Authorization: token },
            });

            return response.data;
          } catch (error) {
            toast.error(error.response.data.error);
            throw error;
          }
        },
      },
    ],
    loader: async ({ params }) => {
      const token = localStorage.getItem("token");
      const decodedToken = decodeToken(token);
      if (!token) {
        throw new Error("Token não encontrado");
      }
      const tokenIssuedAt = decodedToken.iat;
      const expirationDurationInSeconds = 2 * 60 * 60;

      const currentTimeInSeconds = Date.now() / 1000;
      const tokenExpirationTime = tokenIssuedAt + expirationDurationInSeconds;
      if (currentTimeInSeconds >= tokenExpirationTime) {
        localStorage.removeItem("token");
        throw new Error("Parece que o token expirou");
      }
      try {
        const response = await api.get(`account/${params.id}/data`, {
          headers: { Authorization: token },
        });

        return response.data;
      } catch (error) {
        console.error("Erro durante o recebimento de dados:", error);
        console.error("Erro de resposta do servidor:", error.response.data);
        toast.error(error.response.data.error);
        throw error;
      }
    },
  },
]);

export default router;
