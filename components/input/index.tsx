import { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  descriptions?: string[];
  warnings?: string[];
  inputRef?: any;
}

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  warnings?: string[];
}

function Text({
  id,
  label,
  required,
  descriptions = [],
  warnings,
  className = "",
  defaultValue = "",
  inputRef,
  ...rest
}: InputProps) {
  return (
    <div>
      <label htmlFor={id} className={`block ${className}`}>
        <p className="mb-2 text-sm font-semibold leading-6 text-[#09101D]">
          {label}
          {required && (
            <span className="text-[0.8rem] font-semibold text-[#DA1414]">
              *
            </span>
          )}
        </p>
        <input
          ref={inputRef}
          id={id}
          name={id}
          defaultValue={defaultValue}
          type="text"
          className={`w-full rounded-[0.25rem] border border-[#B0B0B0] bg-white px-4 py-2 text-base leading-none placeholder-gray-semilight outline-none focus:border-primary disabled:bg-gray-light disabled:text-[#B0B0B0] ${
            warnings
              ? "border-red-500"
              : "border-gray disabled:border-gray-semilight"
          }`}
          required={required}
          {...rest}
        />
      </label>
      {warnings?.map((warning, i) => (
        <p
          key={i}
          className={`${
            i === 0 ? "mt-4" : "mt-2"
          } text-sm text-red-500 sm:ml-28 sm:pl-[3.5rem]`}
        >
          {warning}
        </p>
      ))}
      {descriptions.map((description, i) => (
        <p
          key={i}
          className={`${
            i === 0 ? "mt-4" : "mt-2"
          } text-gray whitespace-pre-wrap text-sm sm:ml-28 sm:pl-[3.5rem]`}
        >
          {"ⓘ "}
          {description}
        </p>
      ))}
    </div>
  );
}

function TextArea({
  id,
  label,
  required,
  warnings,
  defaultValue = "",
  className = "",
  ...rest
}: TextAreaProps) {
  return (
    <div>
      <label htmlFor={id} className={`block ${className}`}>
        <p className="mb-2 text-sm font-semibold leading-6 text-[#09101D]">
          {label}
          {required && (
            <span className="text-[0.8rem] font-semibold text-[#DA1414]">
              *
            </span>
          )}
        </p>
        <textarea
          id={id}
          name={id}
          defaultValue={defaultValue}
          className={`scrollbar-none h-40 w-full rounded-[0.25rem] border border-[#B0B0B0] bg-white px-4 py-2 text-base leading-none placeholder-gray-semilight outline-none focus:border-primary disabled:bg-gray-light disabled:text-[#B0B0B0] ${
            warnings ? "border-red-500" : "border-gray"
          }`}
          required={required}
          {...rest}
        />
      </label>
      {warnings?.map((warning, i) => (
        <p
          key={i}
          className={`${
            i === 0 ? "mt-4" : "mt-2"
          } text-sm text-red-500 sm:ml-28 sm:pl-[3.5rem]`}
        >
          {warning}
        </p>
      ))}
    </div>
  );
}

function File(props: InputProps) {
  return <Text {...props} type="file" />;
}

const Input = { Text, TextArea, File };
export default Input;
