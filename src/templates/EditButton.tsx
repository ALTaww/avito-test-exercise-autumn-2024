import React, { FC } from "react";
import EditIcon from "@mui/icons-material/Edit";
import "../css/edit-button.css";

interface IComponent extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const EditButton: FC<IComponent> = ({ ...props }) => {
  return (
    <button {...props} className="edit-button">
      <EditIcon />
    </button>
  );
};

export default EditButton;
