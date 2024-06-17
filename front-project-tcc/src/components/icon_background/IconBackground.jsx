import style from "./style.module.css";

export default function IconBackground({ children, bgColor }) {
  const iconBg = `${style.iconBgd} ${bgColor}`;

  return <div className={iconBg}>{children}</div>;
}
