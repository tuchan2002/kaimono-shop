import React, { useContext } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import Swal from "sweetalert2";
import Rating from "../../components/rating/rating";

const ProductCard = ({ product, isAdmin, deleteProduct, handleCheck }) => {
  const { _id, title, price, description, images, sold } = product;

  const state = useContext(GlobalState);
  const addCart = state.userAPI.addCart;

  const handleDeleteProduct = async (id, public_id) => {
    await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await deleteProduct(id, public_id);
        Swal.fire({
          icon: "success",
          text: response.data.msg,
        });
      }
    });
  };

  return (
    <div className="relative">
      {isAdmin && (
        <>
          <div className="absolute custom-checkbox">
            <input
              type="checkbox"
              checked={product.checked}
              onChange={() => handleCheck(_id)}
              id={"cb" + _id}
            />
            <label htmlFor={"cb" + _id}></label>
          </div>
          <div
            className="m-2 absolute top-0 right-0 rounded-md p-1 cursor-pointer hover:bg-secondary transition-all"
            onClick={() => handleDeleteProduct(_id, images.public_id)}
          >
            <IoTrashOutline size={22} />
          </div>
        </>
      )}
      <Link to={isAdmin ? `/edit_product/${_id}` : `/detail/${_id}`}>
        <div className="min-h-[390px] bg-white flex flex-col gap-2 overflow-hidden rounded-lg custom-shadow transition-all duration-300">
          <div className="h-60">
            <img
              src={images.url}
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className="py-2 px-3">
            <h4>{title}</h4>
            <span className="text-primary">${price}</span>
            <p className="line-clamp">{description}</p>
            <div className="mt-2 flex justify-between">
              <Rating props={product} size="small" />
              <h5>Sold: {sold}</h5>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
