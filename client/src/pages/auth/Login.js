import axios from "../../api/axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/login", {
        ...user,
      });

      localStorage.setItem("firstLogin", true);

      await Swal.fire({
        icon: "success",
        text: "LOGIN SUCCESSFUL.",
      });
      window.location.href = "/";
    } catch (error) {
      Swal.fire({
        icon: "warning",
        text: error.response.data.msg,
      });
    }
  };

  return (
    <form
      onSubmit={onSubmitForm}
      className="max-w-md mt-10 mx-auto p-5 flex flex-col items-center gap-7 bg-white rounded-xl shadow-lg"
    >
      <h2>LOGIN</h2>
      <input
        type="email"
        name="email"
        required
        placeholder="Email"
        value={user.email}
        onChange={onChangeForm}
        className="border outline-none rounded-sm py-2 px-3 w-full"
      />

      <input
        type="password"
        name="password"
        required
        autoComplete="on"
        placeholder="Password"
        value={user.password}
        onChange={onChangeForm}
        className="border outline-none rounded-sm py-2 px-3 w-full"
      />

      <div className="w-full flex justify-between items-center">
        <button
          type="submit"
          className="bg-primary text-white px-5 py-2 uppercase font-bold rounded-sm"
        >
          Login
        </button>
        <Link
          to="/register"
          className="uppercase font-bold underline text-blue-500"
        >
          Register
        </Link>
      </div>
    </form>
  );
};

export default Login;
