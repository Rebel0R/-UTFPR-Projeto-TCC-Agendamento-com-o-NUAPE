import style from "./style.module.css";

export default function Checkbox({ label, isChecked, onChange, name }) {
  return (
    <div className={style.checkboxContainer}>
      <input
        type="checkbox"
        id={label}
        name={name}
        value={label}
        checked={isChecked}
        onChange={onChange}
      />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}
