import style from "./style.module.css";

export default function IconButton({ children, bgColor, link }) {
  const iconBtnClasses = `${style.iconButton} ${bgColor}`;

  return (
    <div className={iconBtnClasses}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={style.linkIconButton}
      >
        {children}
      </a>
    </div>
  );
}
