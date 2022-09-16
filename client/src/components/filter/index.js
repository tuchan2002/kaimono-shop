import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState";

const Filter = () => {
  const state = useContext(GlobalState);
  const [sort, setSort] = state.productsAPI.sort;

  return (
    <div>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="outline-none bg-transparent border-b"
      >
        <option value="">Newest</option>
        <option value="sort=oldest">Oldest</option>
        <option value="sort=-sold">Best sales</option>
        <option value="sort=-price">Price: High-Low</option>
        <option value="sort=price">Price: Low-High</option>
      </select>
    </div>
  );
};

export default Filter;
