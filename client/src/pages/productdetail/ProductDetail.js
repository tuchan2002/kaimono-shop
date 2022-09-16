import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios";
import BackButton from "../../components/BackButton";
import CommentCreateForm from "../../components/commentCreateForm";
import CommentItem from "../../components/commentItem";
import Rating from "../../components/rating/rating";
import { GlobalState } from "../../GlobalState";
import ProductCard from "../products/ProductCard";
import Loading from "../../util/images/loading.gif";

const ProductDetail = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const addCart = state.userAPI.addCart;
  const [userInfo] = state.userAPI.userInfo;
  const [isLogged] = state.userAPI.isLogged;
  const [token] = state.token;
  const socket = state.socket;
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(false);

  // comment
  const [comments, setComments] = useState([]);
  const [pageComment, setPageComment] = useState(1);
  const [resultComment, setResultComment] = useState(0);
  const [callbackComment, setCallbackComment] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      setLoading(true);
      const response = await axios.get(
        `/api/comments/${params.id}?limit=${pageComment * 5}`
      );
      setComments(response.data.comments);
      setResultComment(response.data.result);
      setLoading(false);
    };

    getComments();
  }, [params.id, pageComment, callbackComment]);

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (data) => {
        setComments([data, ...comments]);
      });

      return () => socket.off("sendCommentToClient");
    }
  }, [socket, comments]);

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) {
          setProductDetail(product);
        }
      });
    }
  }, [params.id, products]);

  useEffect(() => {
    if (socket && userInfo) {
      socket.emit("joinRoom", { userId: userInfo?._id, roomId: params.id });
    }
  }, [socket, params.id, userInfo]);

  if (productDetail.length === 0) {
    return null;
  }

  return (
    <div className="">
      <div className="p-5 bg-white rounded-lg">
        <BackButton />
        <div className="flex gap-10">
          <div className="h-96 w-80 rounded-sm overflow-hidden">
            <img
              src={productDetail.images.url}
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h2 className="uppercase">{productDetail.title}</h2>
            <span className="text-primary">$ {productDetail.price}</span>
            <p>{productDetail.description}</p>
            <p>{productDetail.content}</p>
            <h5>Sold: {productDetail.sold}</h5>

            <div className="flex gap-8 items-center">
              <Rating props={productDetail} />
              <span className="font-bold text-3xl">
                {productDetail.numReviews !== 0
                  ? (productDetail.star / productDetail.numReviews).toFixed(1)
                  : 0}
                <span className="text-base">/5</span>
              </span>
            </div>

            <div className="mt-5">
              <Link
                to="#!"
                className="px-10 text-center bg-primary text-white py-2 uppercase font-bold rounded-sm"
                onClick={() => {
                  addCart(productDetail);
                }}
              >
                add to cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 p-5 bg-white rounded-lg">
        {isLogged && (
          <CommentCreateForm
            id={params.id}
            callbackComment={callbackComment}
            setCallbackComment={setCallbackComment}
          />
        )}

        <div className="">
          {comments.length === 0 ? (
            <p className="text-center text-lg">There are no reviews yet.</p>
          ) : (
            <>
              {comments?.map((comment, index) => (
                <CommentItem key={index} comment={comment} />
              ))}
              {resultComment < pageComment * 5 ? (
                ""
              ) : (
                <div className="flex justify-center">
                  <span
                    className="uppercase font-bold text-lg cursor-pointer hover:text-primary-blur transition-all"
                    onClick={() => {
                      setPageComment((prev) => prev + 1);
                    }}
                  >
                    Load More
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {loading && (
          <div className="">
            <img src={Loading} alt="" />
          </div>
        )}
      </div>
      <div className="mt-5">
        <h2 className="mb-5">Related products</h2>
        <div className="grid grid-cols-5 gap-5">
          {products.map((product) =>
            product.category === productDetail.category ? (
              <ProductCard key={product._id} product={product} />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
