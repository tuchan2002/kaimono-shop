import React, { useState, useContext } from "react";
import { GlobalState } from "../../GlobalState";
import axios from "../../api/axios";
import { IoArrowForwardCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import BackButton from "../../components/BackButton";

const Categories = () => {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const response = await axios.put(
          `/api/categories/${id}`,
          { name: category },
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
          "/api/categories",
          { name: category },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        await Swal.fire({
          icon: "success",
          text: response.data.msg,
        });
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (error) {
      Swal.fire({
        icon: "warning",
        text: error.response.data.msg,
      });
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  const deleteCategory = async (id) => {
    try {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await axios.delete(`/api/categories/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire({
            icon: "success",
            text: response.data.msg,
          });
          setCallback(!callback);
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "warning",
        text: error.response.data.msg,
      });
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg ">
      <BackButton />
      <div className="flex gap-16">
        <form onSubmit={createCategory} className="flex h-fit gap-2">
          <input
            type="text"
            name="category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
            className="border outline-none rounded-sm py-2 px-3"
            placeholder="Enter category..."
          />

          <button
            type="submit"
            className="flex gap-2 items-center p-2 rounded-sm bg-primary text-white font-bold uppercase"
          >
            <IoArrowForwardCircle size={20} />
            <span>{onEdit ? "Update" : "Create"}</span>
          </button>
        </form>

        <div className="flex-1">
          {categories.map((category) => (
            <div
              className="flex p-2 border-y justify-between"
              key={category._id}
            >
              <p className="">{category.name}</p>
              <div className="flex gap-4">
                <button
                  className="bg-primary text-white font-bold py-2 px-3 uppercase"
                  onClick={() => editCategory(category._id, category.name)}
                >
                  Edit
                </button>
                <button
                  className="bg-primary text-white font-bold py-2 px-3 uppercase"
                  onClick={() => deleteCategory(category._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Categories;
