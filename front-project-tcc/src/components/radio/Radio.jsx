import style from "./style.module.css";

export default function Radio({ label, isChecked, onChange, name }) {
  return (
    <div className={style.radioContainer}>
      <input
        type="radio"
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
