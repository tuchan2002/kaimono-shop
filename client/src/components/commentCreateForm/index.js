import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { IoSendOutline, IoStar } from "react-icons/io5";
import axios from "../../api/axios";
import { GlobalState } from "../../GlobalState";

const CommentCreateForm = ({ id, callbackComment, setCallbackComment }) => {
  const state = useContext(GlobalState);
  const [content, setContent] = useState("");
  const [userInfo] = state.userAPI.userInfo;
  const socket = state.socket;
  const [token] = state.token;
  const [star, setStar] = useState(0);

  const onChangeInput = (e) => {
    setContent(e.target.value);
  };

  const commentSubmit = async () => {
    const createdAt = new Date().toISOString();
    socket.emit("createComment", {
      name: userInfo.name,
      content,
      product_id: id,
      createdAt,
      star,
    });

    if (star && star !== 0) {
      const response = await axios.patch(
        `/api/products/${id}`,
        {
          star,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
    }

    setContent("");
    setCallbackComment(!callbackComment);
  };

  return (
    <div className="mb-8">
      <div className="flex gap-8 items-center">
        <div className="border flex-1 rounded-md">
          <div className="p-2 pb-0 w-fit flex flex-row-reverse reviews">
            <input
              type="radio"
              name="rate"
              id="rd-5"
              onChange={() => setStar(5)}
            />
            <label htmlFor="rd-5">
              <IoStar size={28} className="text-gray-300" />
            </label>
            <input
              type="radio"
              name="rate"
              id="rd-4"
              onChange={() => setStar(4)}
            />
            <label htmlFor="rd-4">
              <IoStar size={28} className="text-gray-300" />
            </label>
            <input
              type="radio"
              name="rate"
              id="rd-3"
              onChange={() => setStar(3)}
            />
            <label htmlFor="rd-3">
              <IoStar size={28} className="text-gray-300" />
            </label>
            <input
              type="radio"
              name="rate"
              id="rd-2"
              onChange={() => setStar(2)}
            />
            <label htmlFor="rd-2">
              <IoStar size={28} className="text-gray-300" />
            </label>
            <input
              type="radio"
              name="rate"
              id="rd-1"
              onChange={() => setStar(1)}
            />
            <label htmlFor="rd-1">
              <IoStar size={28} className="text-gray-300" />
            </label>
          </div>
          <textarea
            placeholder="Enter content..."
            type="text"
            required
            value={content}
            rows="3"
            onChange={(e) => {
              onChangeInput(e);
            }}
            className="outline-none w-full py-2 px-3"
          />
        </div>
        <button
          onClick={commentSubmit}
          className="text-white bg-primary font-bold h-fit rounded-full p-2"
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default CommentCreateForm;
