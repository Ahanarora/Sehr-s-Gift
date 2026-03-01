import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import "../App.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = ({ variant = "primary", children, ...rest }: PropsWithChildren<ButtonProps>) => {
  return (
    <button className={`bb-btn bb-${variant}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
