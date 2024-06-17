import style from "./style.module.css";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className={style.errorContainer}>
      <img
        src="/images/img_404-error.svg"
        alt="Imagem de erro 404 - Página não encontrada"
        className={style.errorImg}
      />
      <p className={style.errorText}>
        Ops! Parece que a página que você procura não foi encontrada!
      </p>
      <Link to="/">
        <button className="btn-filed-yellow">Voltar para home</button>
      </Link>
    </div>
  );
}
