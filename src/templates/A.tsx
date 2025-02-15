import React, { FC } from "react";

interface IComponent {
  href: string;
  children: React.ReactNode | React.ReactElement;
  props?: any;
}

const A: FC<IComponent> = ({ href, children, ...props }) => {
  return (
    <a href={href} rel="noopenner norefferer" {...props}>
      {children}
    </a>
  );
};

export default A;
