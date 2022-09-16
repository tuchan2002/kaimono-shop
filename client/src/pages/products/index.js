import React, { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import Loading from "../loading/Loading";
import ProductCard from "./ProductCard";
import axios from "../../api/axios";
import Filter from "../../components/filter";
import LoadMore from "../../components/loadmore";
import Swal from "sweetalert2";

const Products = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheckAll, setIsCheckAll] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) {
        product.checked = !product.checked;
      }
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImage = axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await destroyImage;
      const response = await deleteProduct;
      setCallback(!callback);
      setLoading(false);
      return response;
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheckAll;
    });
    setProducts([...products]);
    setIsCheckAll(!isCheckAll);
  };

  const deleteAll = async () => {
    const check = products.some((product) => {
      return product.checked === true;
    });
    if (check) {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          products.forEach((product) => {
            if (product.checked) {
              deleteProduct(product._id, product.images.public_id);
            }
          });
          Swal.fire({
            icon: "success",
            text: "Deleted All Products!",
          });
        }
      });
    }
  };

  if (loading || products.length === 0) {
    return (
      <div className="mt-16">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end justify-between mb-7">
        <Filter />
        {isAdmin && (
          <div className="relative flex gap-2 items-center -mt-2">
            <div className="custom-checkbox">
              <input
                type="checkbox"
                checked={isCheckAll}
                onChange={checkAll}
                id={"cb-all"}
              />
              <label htmlFor={"cb-all"}></label>
            </div>
            <button
              className="bg-primary text-white py-1 px-2 font-bold uppercase rounded-md hover:bg-primary-blur transition-all"
              onClick={deleteAll}
            >
              Delete All
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-5 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isAdmin={isAdmin}
            handleCheck={handleCheck}
            deleteProduct={deleteProduct}
          />
        ))}
      </div>
      <LoadMore />
    </>
  );
};

export default Products;
