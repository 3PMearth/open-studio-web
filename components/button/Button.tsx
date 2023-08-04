import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  small?: boolean;
}

type ButtonColor = "ok" | "cancel";

export default function Button({
  children,
  color = "ok",
  className = "",
  small,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`rounded-lg px-5 text-center ${
        small ? "text-sm leading-7" : "min-w-[7.5rem] leading-10"
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
