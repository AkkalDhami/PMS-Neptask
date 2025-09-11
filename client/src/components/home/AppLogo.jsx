import React from "react";
import { useNavigate } from "react-router-dom";

const AppLogo = ({ size = "lg" }) => {
  const navigate = useNavigate();
  return (
    <h1
      onClick={() => navigate("/")}
      className={`text-2xl cursor-pointer sm:text-3xl bg-gradient ${
        size === "md" ? "md:text-2xl" : "md:text-4xl"
      }  font-bold text-transparent bg-clip-text`}>
      NepTask.
    </h1>
  );
};

export default AppLogo;
