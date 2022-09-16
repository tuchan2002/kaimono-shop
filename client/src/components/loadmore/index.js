import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState";

const LoadMore = () => {
  const state = useContext(GlobalState);
  const [page, setPage] = state.productsAPI.page;
  const [result] = state.productsAPI.result;

  return result < page * 15 ? (
    ""
  ) : (
    <div className="mx-auto mt-5 bg-white font-bold p-2 rounded-sm text-center w-1/3 cursor-pointer shadow-md hover:bg-[#fafafa]">
      <button className="uppercase" onClick={() => setPage(page + 1)}>
        Load more
      </button>
    </div>
  );
};

export default LoadMore;
