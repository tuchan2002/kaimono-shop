import { useState, useEffect } from "react";
import axios from "../api/axios";

function CategoriesAPI() {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    };

    getCategories();
  }, [callback]);
  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
}

export default CategoriesAPI;
