import axios from "../../api/axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirm_password) {
      Swal.fire({
        icon: "warning",
        text: "Password do not match.",
      });
      return;
    }

    try {
      await axios.post("/user/register", { ...user });

      localStorage.setItem("firstLogin", true);

      await Swal.fire({
        icon: "success",
        text: "Congratulations, your account has been successfully created.",
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
      <h2>REGISTER</h2>
      <input
        type="name"
        name="name"
        required
        placeholder="Name"
        value={user.name}
        onChange={onChangeForm}
        className="border outline-none rounded-sm py-2 px-3 w-full"
      />

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

      <input
        type="password"
        name="confirm_password"
        required
        autoComplete="on"
        placeholder="Confirm Password"
        value={user.confirm_password}
        onChange={onChangeForm}
        className="border outline-none rounded-sm py-2 px-3 w-full"
      />

      <div className="w-full flex justify-between items-center">
        <button
          type="submit"
          className="bg-primary text-white px-5 py-2 uppercase font-bold rounded-sm"
        >
          Register
        </button>
        <Link
          to="/login"
          className="uppercase font-bold underline text-blue-500"
        >
          Login
        </Link>
      </div>
    </form>
  );
};

export default Register;
