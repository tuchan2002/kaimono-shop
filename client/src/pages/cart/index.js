import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../GlobalState";
import { IoTrashOutline } from "react-icons/io5";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  const [callback, setCallback] = state.userAPI.callback;

  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);
  console.log("CART", cart);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/add_cart",
      { cart },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]); // nhu nay thi no se tao ra 1 arr moi (khac dia chi), neu khong no se so sanh la bang nhau (do co cung dia chi)
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity = item.quantity === 1 ? 1 : item.quantity - 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };
  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };

  const handleBuyNow = async () => {
    const { value: address } = await Swal.fire({
      title: "Please enter your address",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write address!";
        }
      },
    });

    await axios.post(
      "/api/payment",
      { cart, address },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCart([]);
    addToCart([]);
    Swal.fire({
      icon: "success",
      text: "You have successfully placed an order.",
    });
    setCallback(!callback);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center gap-2 mt-5">
        <div className="w-80">
          <img
            src="https://www.99fashionbrands.com/wp-content/uploads/2020/12/empty_cart.png"
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <Link
            to="/"
            className="px-10 text-center bg-primary text-white py-2 uppercase font-bold rounded-sm hover:bg-primary-blur"
          >
            shop now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {cart.map((product) => (
        <div
          className="bg-white flex justify-between border p-3 pt-5 rounded-md "
          key={product._id}
        >
          <div className="flex gap-5">
            <div className="h-24 w-24 rounded-md overflow-hidden">
              <Link to={`/detail/${product._id}`}>
                <img
                  src={product.images.url}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </Link>
            </div>
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
            </div>
          </div>
          <div className="flex gap-12">
            <h4 className="text-primary">
              $ {product.price * product.quantity}
            </h4>
            <div className="flex gap-3">
              <button
                className="text-lg font-medium border-2 w-8 h-8 flex justify-center items-center hover:border-primary transition-all"
                onClick={() => {
                  decrement(product._id);
                }}
              >
                -
              </button>
              <span className="text-primary text-xl">{product.quantity}</span>
              <button
                className="text-lg font-medium border-2 w-8 h-8 flex justify-center items-center hover:border-primary transition-all"
                onClick={() => {
                  increment(product._id);
                }}
              >
                +
              </button>
            </div>
            <div
              onClick={() => {
                removeProduct(product._id);
              }}
              className="h-fit rounded-md p-1 cursor-pointer hover:bg-secondary transition-all"
            >
              <IoTrashOutline size={22} />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-primary">
          Total: $ {total}
        </span>
        <button
          className="bg-primary px-5 py-2 font-bold text-white rounded-sm"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default Cart;
