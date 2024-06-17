import style from "./style.module.css";
import FormRegister from "./form_register/FormRegister";
import FormLogin from "./form_login/FormLogin";
import { Link } from "react-router-dom";

export default function FormCard({
  title,
  description,
  typeForm,
  textButton,
  footerText,
}) {
  return (
    <div className={style.cardFormContainer}>
      <div className={style.titleContent}>
        <p className={style.cardFormTitle}>{title}</p>
        <p className={style.cardFormDescription}>{description}</p>
      </div>
      {typeForm === "login" ? <FormLogin /> : <FormRegister />}
      <div className={style.cardFormContentText}>
        <p className={`${style.cardFormDescription} ${style.mediumText}`}>
          {footerText}
        </p>
        {typeForm === "login" ? (
          <Link to="/register" className={style.cardFormLink}>
            Clique aqui!
          </Link>
        ) : (
          <Link to="/login" className={style.cardFormLink}>
            Clique aqui!
          </Link>
        )}
      </div>
    </div>
  );
}
