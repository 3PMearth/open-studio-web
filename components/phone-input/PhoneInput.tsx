import { useLocale } from "next-intl";
import ReactPhoneInput, { PhoneInputProps } from "react-phone-input-2";
import ko from "react-phone-input-2/lang/ko.json";
import "react-phone-input-2/lib/style.css";

import style from "./PhoneInput.module.scss";

interface Props extends PhoneInputProps {
  className?: string;
  disabled?: boolean;
  onValueChange?: ({
    countryCode,
    phoneNumber
  }: {
    countryCode: string;
    phoneNumber: string;
  }) => void;
}

const PhoneInput = ({
  className,
  disabled,
  onValueChange,
  value,
  inputProps,
  ...rest
}: Props) => {
  const locale = useLocale();

  const handleChange = (value, country) => {
    if (onValueChange) {
      onValueChange({
        countryCode: country.dialCode,
        phoneNumber: value.slice(country.dialCode.length)
      });
    }
  };

  return (
    // wrapper for CSS specificity
    <div
      className={`${style.PhoneInput} ${className} ${
        disabled ? "pointer-events-none" : ""
      }`}
    >
      <ReactPhoneInput
        country={locale === "ko" ? "kr" : "us"}
        countryCodeEditable={false}
        inputProps={{
          ...inputProps,
          disabled,
          placeholder: "",
          name: "phone"
        }}
        containerClass={style["PhoneInput-container"]}
        buttonClass={style["PhoneInput-button"]}
        inputClass={style["PhoneInput-input"]}
        localization={locale === "ko" ? ko : undefined}
        onChange={handleChange}
        priority={{ kr: 0, us: 1 }}
        value={value}
        {...rest}
      />
    </div>
  );
};

export default PhoneInput;
