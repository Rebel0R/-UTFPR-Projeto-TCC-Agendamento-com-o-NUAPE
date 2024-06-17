import FormCard from "../../components/card_form/FormCard";
import style from "./style.module.css";

export default function Register() {
  return (
    <main className={style.registerContainer}>
      <div className={style.registerLeftSideContent}>
        <FormCard
          title="Bem vindo!"
          description="Cadastre-se agora para agendar reuniões com nossos profissionais do NUAPE"
          footerText="Já possui uma conta? "
          typeForm="register"
          textButton="Cadastrar"
        />
      </div>
      <div className={style.registerRightSideContent}>
        <img
          src="/images/banner-register.svg"
          alt="Banner de Login"
          className={style.registerBannerImg}
        />
      </div>
    </main>
  );
}
