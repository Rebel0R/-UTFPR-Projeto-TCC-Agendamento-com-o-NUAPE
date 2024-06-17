import style from "./style.module.css";
export default function InnerTitle({ title, description }) {
  return (
    <div className={style.innerTitleContainer}>
      <h1 className="title">{title} </h1>
      <p className="description">{description}</p>
    </div>
  );
}
