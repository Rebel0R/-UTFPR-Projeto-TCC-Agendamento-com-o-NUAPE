import FormCard from "../../components/card_form/FormCard";
import style from "./style.module.css";

export default function Login() {
  return (
    <main className={style.loginContainer}>
      <div className={style.loginLeftSideContent}>
        <img
          src="/images/banner-login.svg"
          alt="Banner de Login"
          className={style.loginBannerImg}
        />
      </div>
      <div className={style.loginRightSideContent}>
        <FormCard
          title="Bem vindo de volta!"
          description="Faça login para acessar sua conta"
          footerText="Não possui uma conta? "
          typeForm="login"
          textButton="Entrar"
        />
      </div>
    </main>
  );
}
