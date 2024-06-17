import style from "./style.module.css";
import { IoAlertCircle } from "react-icons/io5";

export default function Input({
  label,
  type,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
  error,
  required,
}) {
  return (
    <div className={style.inputContainer}>
      <div>
        <label>{label}</label>
        {required && <span id={style.inputRequired}>*</span>}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ""}
        name={name}
        id={name}
        onChange={onChange}
        onBlur={onBlur}
        className={`${error ? "input-error" : "input-pattern"}`}
        required={required}
      />
      {error && (
        <span className={style.inputErrorMessage}>
          <IoAlertCircle
            style={{
              color: "var(--pattern-red)",
              minWidth: "16px",
              minHeight: "16px",
              height: "16px",
              margin: "0 0.25rem 0 0",
            }}
          />
          {error}
        </span>
      )}
    </div>
  );
}
