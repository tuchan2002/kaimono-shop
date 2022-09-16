import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const UserAPI = (token) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const response = await axios.get(`/user/information`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserInfo(response.data);
          setIsLogged(true);
          response.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          setCart(response.data.cart);
          console.log(response);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const response = await axios.get("/api/payment", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHistory(response.data);
        } else {
          const response = await axios.get("/user/history", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setHistory(response.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, callback]);

  const addCart = async (product) => {
    if (!isLogged) {
      return alert("Please login to continue buying");
    }

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/user/add_cart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      alert("This product has been added to cart.");
    }
  };

  return {
    userInfo: [userInfo, setUserInfo],
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    callback: [callback, setCallback],
    history: [history, setHistory],
  };
};

export default UserAPI;
