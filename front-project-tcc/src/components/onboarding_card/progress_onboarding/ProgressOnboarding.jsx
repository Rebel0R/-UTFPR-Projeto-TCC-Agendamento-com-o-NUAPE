import style from "./style.module.css";

export default function ProgressOnboarding({ progress }) {
  return (
    <div className={style.progressBar}>
      <hr
        className={`${style.bar} ${
          progress === 1 ? style.active : style.disabled
        }`}
      />
      <hr
        className={`${style.bar} ${
          progress === 2 ? style.active : style.disabled
        }`}
      />
      <hr
        className={`${style.bar} ${
          progress === 3 ? style.active : style.disabled
        }`}
      />
    </div>
  );
}
