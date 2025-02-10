import React, { FC } from "react";

interface IComponent {
  children: React.ReactNode;
  className?: string;
  props?: unknown;
}

const ComponentContainer: FC<IComponent> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className="container">
      <div
        className={`container-body ${className ? " " + className : ""}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default ComponentContainer;
