import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { IoMenuSharp, IoCloseSharp, IoCartOutline } from "react-icons/io5";
import axios from "../../api/axios";
const Header = () => {
  const location = useLocation();
  let routePathPattern = location.pathname;
  console.log("routePathPattern", routePathPattern);
  const state = useContext(GlobalState);
  const [isLogged, setIsLogged] = state.userAPI.isLogged;
  const [isAdmin, setIsAdmin] = state.userAPI.isAdmin;
  const [cart, setCart] = state.userAPI.cart;
  const [search, setSearch] = state.productsAPI.search;
  const [categories] = state.categoriesAPI.categories;
  const [categorySelected, setCategorySelected] =
    state.productsAPI.categorySelected;

  const handleCategory = (value) => {
    setCategorySelected(value);
    setSearch("");
  };

  const logoutUser = async () => {
    await axios.get("/user/logout");

    localStorage.removeItem("firstLogin");

    window.location.href = "/"; // refresh page
  };

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li>
          <Link to="/categories">Categories</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };

  return (
    <div className="px-5 text-white bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="py-3 flex items-center justify-around gap-10">
          <div className="hidden">
            <IoMenuSharp />
          </div>

          <div className="font-bold text-3xl italic">
            <Link to="/">{isAdmin ? "Admin" : "Kaimono"}</Link>
          </div>

          <input
            type="text"
            value={search}
            placeholder="Search on TATShop..."
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            className="flex-1 outline-none rounded-sm px-3 py-2 text-black"
          />

          <ul className="flex gap-6 uppercase">
            <li>
              <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
            </li>

            {isAdmin && adminRouter()}
            {isLogged ? (
              loggedRouter()
            ) : (
              <li>
                <Link to="/login">Login / Register</Link>
              </li>
            )}

            <li className="hidden">
              <IoCloseSharp />
            </li>
          </ul>

          {isAdmin ? (
            ""
          ) : (
            <div className="relative">
              <span className="absolute bg-white text-sm text-primary rounded-full px-1 top-0 right-0 translate-y-[-20%] translate-x-[20%]">
                {cart.length}
              </span>
              <Link to="/cart">
                <IoCartOutline size={40} />
              </Link>
            </div>
          )}
        </div>
        {routePathPattern === "/" ? (
          <ul className="flex font-medium overflow-x-scroll whitespace-nowrap no-scrollbar">
            <li
              className={`p-3 relative ${
                categorySelected === ""
                  ? "before:content-[''] before:absolute before:w-full before:py-[2px] before:bg-white before:bottom-0 before:left-0"
                  : ""
              } cursor-pointer hover:bg-primary-blur transition-all`}
              onClick={() => handleCategory("")}
            >
              All products
            </li>
            {categories &&
              categories?.map((category) => (
                <li
                  className={`p-3 relative ${
                    categorySelected === "category=" + category._id
                      ? "before:content-[''] before:absolute before:w-full before:py-[2px] before:bg-white before:bottom-0 before:left-0"
                      : ""
                  } cursor-pointer hover:bg-[#f1514f] transition-all`}
                  onClick={() => handleCategory("category=" + category._id)}
                  key={category._id}
                >
                  {category.name}
                </li>
              ))}
          </ul>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Header;
