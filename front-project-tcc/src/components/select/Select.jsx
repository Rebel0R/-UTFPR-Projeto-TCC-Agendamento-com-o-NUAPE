import style from "./style.module.css";
import { IoAlertCircle } from "react-icons/io5";

export default function Select({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error,
  required,
}) {
  return (
    <div className={style.selectContainer}>
      <div>
        <label>{label}</label>
        {required && <span id={style.selectRequired}>*</span>}
      </div>

      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "input-error" : "input-pattern"}
        required={required}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className={style.selectErrorMessage}>
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
