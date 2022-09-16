import React, { useContext, useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { GlobalState } from "../../GlobalState";

const OrderDetail = () => {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [orderDetail, setOrderDetail] = useState([]);
  console.log("HISTORY", history);

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) {
          setOrderDetail(item);
        }
      });
    }
  }, [params.id, history]);

  if (orderDetail.length === 0) {
    return null;
  }

  return (
    <div className="p-5 bg-white rounded-lg ">
      <BackButton url="/history" />
      <div className="flex flex-col gap-5">
        <div>
          <div className="flex">
            <span className="font-bold min-w-[100px]">Name:</span>
            <span>{orderDetail.name}</span>
          </div>
          <div className="flex">
            <span className="font-bold min-w-[100px]">Address:</span>
            <span>{orderDetail.address}</span>
          </div>
        </div>

        <table className="">
          <thead>
            <tr className="text-left">
              <th></th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orderDetail.cart.map((item) => (
              <tr key={item._id} className="border-y">
                <td className="py-2 flex justify-center">
                  <div className="w-36 h-30">
                    <img
                      src={item.images.url}
                      alt=""
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>$ {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetail;
