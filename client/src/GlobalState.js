import axios from "./api/axios";
import { createContext, useEffect, useState } from "react";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import io from "socket.io-client";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await axios.get("/user/refresh_token");

        setToken(res.data.accesstoken);

        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };
      refreshToken();
    }

    // socketio
    const socket = io();
    setSocket(socket);
    return () => socket.close();
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
    socket,
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
