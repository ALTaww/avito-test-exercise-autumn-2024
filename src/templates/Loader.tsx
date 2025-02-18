import { CircularProgress, CircularProgressProps } from "@mui/material";
import React, { FC } from "react";

interface IComponent extends CircularProgressProps {
  text?: string | null;
}

const Loader: FC<IComponent> = ({ text = "Loading...", ...props }) => {
  return (
    <div className="loader-component">
      <CircularProgress {...props} />
      {text ? <div className="loader">{text}</div> : null}
    </div>
  );
};

export default Loader;
