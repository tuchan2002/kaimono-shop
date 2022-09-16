import React from "react";
import moment from "moment";
import Rating from "../rating/rating";

const CommentItem = ({ comment }) => {
  return (
    <div className="border-t pt-2 pb-3 flex justify-between items-start">
      <div className="">
        <h4 className="">{comment.name}</h4>
        <div className="text-sm">
          <span className="mr-5">{moment(comment.createdAt).fromNow()}</span>
          <span>{new Date(comment.createdAt).toLocaleString()}</span>
        </div>

        <p className="mt-2">{comment.content}</p>
      </div>
      <Rating props={comment} size="small" />
    </div>
  );
};

export default CommentItem;
