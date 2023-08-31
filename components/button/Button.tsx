import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  size?: ButtonSize;
}

type ButtonColor = "ok" | "cancel";
type ButtonSize = "small" | "normal" | "large";

export default function Button({
  children,
  color = "ok",
  className = "",
  size = "normal",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`rounded-lg px-5 text-center disabled:bg-gray-semilight ${
        size === "small"
          ? "text-sm leading-7"
          : size === "large"
          ? "text-lg leading-[3rem]"
          : "min-w-[7.5rem] leading-10"
      } ${
        color === "ok"
          ? "bg-primary text-white"
          : "bg-gray-light text-gray-extradark"
      } ${className}`}
    >
      {children}
    </button>
  );
}
