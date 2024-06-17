import style from "./style.module.css";
import IconBackground from "../../components/icon_background/IconBackground";
import { IoIosArrowForward } from "react-icons/io";

export default function Card({ children, bgColor, title, description }) {
  return (
    <div className={style.cardContainer}>
      <IconBackground bgColor={bgColor}>{children}</IconBackground>
      <p className={style.cardTitle}>{title}</p>
      <p className={style.cardDescription}>{description}</p>
      <a
        href="https://www.utfpr.edu.br/alunos/servicos/apoio"
        target="_blank"
        rel="noopener noreferrer"
        className={style.cardLinkMoreInfo}
      >
        Saiba mais
        <IoIosArrowForward
          style={{ width: "1rem", height: "1rem", color: "#412f65" }}
        />
      </a>
    </div>
  );
}
