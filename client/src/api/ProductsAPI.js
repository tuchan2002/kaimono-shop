import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsAPI = () => {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [categorySelected, setCategorySelected] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      const response = await axios.get(
        `/api/products?limit=${
          page * 15
        }&${categorySelected}&${sort}&title[regex]=${search}`
      );
      setProducts(response.data.products);
      setResult(response.data.result);
    };
    getProducts();
  }, [callback, categorySelected, sort, search, page]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    categorySelected: [categorySelected, setCategorySelected],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    result: [result, setResult],
  };
};

export default ProductsAPI;
