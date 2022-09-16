import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackButton = ({ url }) => {
  const navigate = useNavigate();
  return (
    <IoArrowBackOutline
      onClick={() => navigate(url ? url : -1)}
      size={42}
      className="mb-3 cursor-pointer hover:text-primary-blur transition-all w-fit"
    />
  );
};

export default BackButton;
