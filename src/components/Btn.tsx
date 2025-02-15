import React, { FC } from "react";
import Button, { ButtonProps } from "@mui/material/Button";

interface IComponent extends ButtonProps {
  children: React.ReactNode;
  component?: "button" | "a"; // Явно указываем возможные компоненты
  href?: string;
  color?: ButtonProps["color"]; // Даем TypeScript понять, что color поддерживается
}

const Btn: FC<IComponent> = ({
  children,
  component = "button",
  variant = "contained",
  ...props
}) => {
  return (
    <Button
      className={`btn ${props.className ? " " + props.className : ""}`}
      component={component}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
};

export default Btn;
