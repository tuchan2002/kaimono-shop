import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import axios from "../../api/axios";
import { GlobalState } from "../../GlobalState";
import Loading from "../loading/Loading";
import { IoAdd, IoArrowForwardCircle, IoClose } from "react-icons/io5";
import Swal from "sweetalert2";
import BackButton from "../../components/BackButton";

const initialState = {
  title: "",
  price: 0,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus at massa nec euismod.",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla in nisi sed nisi sollicitudin venenatis. Aenean cursus at massa nec euismod. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
  category: "",
  _id: "",
};

const CreateProduct = () => {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === params.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [params.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) {
        Swal.fire({
          icon: "error",
          text: "You're not an admin",
        });
        return;
      }
      const file = e.target.files[0];

      if (!file) {
        Swal.fire({
          icon: "error",
          text: "File not exist.",
        });
        return;
      }

      if (file.size > 1024 * 1024) {
        Swal.fire({
          icon: "error",
          text: "Size too large!",
        });
        return;
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        Swal.fire({
          icon: "error",
          text: "File format is incorrect.",
        });
        return;
      }

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const response = await axios.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setImages(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response.data.msg,
      });
    }
  };

  const handleDestroy = async () => {
    try {
      if (!isAdmin) {
        Swal.fire({
          icon: "error",
          text: "You're not an admin",
        });
        return;
      }
      setLoading(true);
      await axios.post(
        "/api/destroy",
        { public_id: images.public_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) {
        Swal.fire({
          icon: "error",
          text: "You're not an admin",
        });
        return;
      }
      if (!images) {
        Swal.fire({
          icon: "error",
          text: "No Image Upload",
        });
        return;
      }

      if (onEdit) {
        const response = await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await Swal.fire({
          icon: "success",
          text: response.data.msg,
        });
      } else {
        const response = await axios.post(
          "/api/products",
          { ...product, images },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await Swal.fire({
          icon: "success",
          text: response.data.msg,
        });
      }
      setCallback(!callback);
      navigate("/");
    } catch (error) {
      console.log("error????");
      alert(error.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };
  return (
    <div className="flex flex-col p-5 bg-white rounded-lg">
      <BackButton />
      <div className="flex gap-10">
        <div className="relative h-96 w-80 border">
          <input
            type="file"
            name="file"
            id="file_upload"
            onChange={handleUpload}
            className="hidden"
          />
          <label
            htmlFor="file_upload"
            className="w-full h-full font-bold text-primary-blur flex justify-center items-center cursor-pointer"
          >
            <IoAdd size={200} />
          </label>
          {loading ? (
            <div className="absolute bg-white w-full h-full top-0 left-0 flex justify-center items-center">
              <Loading />
            </div>
          ) : (
            <div
              className="w-full h-full absolute top-0 left-0"
              style={styleUpload}
            >
              <img
                src={images ? images.url : ""}
                alt=""
                className="object-cover w-full h-full"
              />
              <IoClose
                className="border bg-white text-primary absolute top-0 right-0 translate-y-[-50%] translate-x-[50%] cursor-pointer rounded-full"
                size={24}
                onClick={handleDestroy}
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3">
          <div className="flex">
            <label className="inline-block min-w-[180px]" htmlFor="title">
              Title
              <span className="ml-1 font-medium text-primary">*</span>
            </label>
            <input
              placeholder="Enter title..."
              type="text"
              name="title"
              id="title"
              required
              value={product.title}
              onChange={handleChangeInput}
              className="flex-1 border outline-none rounded-sm py-2 px-3"
            />
          </div>

          <div className="">
            <label className="inline-block min-w-[180px]" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              value={product.price}
              onChange={handleChangeInput}
              className="border outline-none rounded-sm py-2 px-3"
            />
          </div>

          <div className="flex">
            <label className="inline-block min-w-[180px]" htmlFor="description">
              Description
            </label>
            <textarea
              placeholder="Enter description..."
              type="text"
              name="description"
              id="description"
              required
              value={product.description}
              rows="3"
              onChange={handleChangeInput}
              className="flex-1 border outline-none rounded-sm py-2 px-3"
            />
          </div>

          <div className="flex">
            <label className="inline-block min-w-[180px]" htmlFor="content">
              Content
            </label>
            <textarea
              placeholder="Enter content..."
              type="text"
              name="content"
              id="content"
              required
              value={product.content}
              rows="5"
              onChange={handleChangeInput}
              className="flex-1 border outline-none rounded-sm py-2 px-3"
            />
          </div>

          <div className="">
            <label className="inline-block min-w-[180px]" htmlFor="categories">
              Categories
              <span className="ml-1 font-medium text-primary">*</span>
            </label>
            <select
              name="category"
              value={product.category}
              onChange={handleChangeInput}
              className="border outline-none rounded-sm py-2 px-3"
            >
              <option value="">Please select a category</option>
              {categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="flex gap-2 items-center px-5 py-2 rounded-sm bg-primary text-white font-bold uppercase self-end"
            type="submit"
          >
            <IoArrowForwardCircle size={20} />
            <span>{onEdit ? "Update" : "Create"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
