import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
}

type ButtonColor = "ok" | "cancel";

export default function Button({
  children,
  color = "ok",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`min-w-[7.5rem] rounded-lg px-5 text-center leading-10 ${
        color === "ok"
          ? "bg-primary text-white"
          : "bg-gray-light text-gray-extradark"
      } ${className}`}
    >
      {children}
    </button>
  );
}
