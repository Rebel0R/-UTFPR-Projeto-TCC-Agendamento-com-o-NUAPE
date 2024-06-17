import IconButton from "./icon_button/IconButton";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BiLogoInstagramAlt } from "react-icons/bi";
import { TbMailFilled } from "react-icons/tb";
import { RiGlobalFill } from "react-icons/ri";
import style from "./style.module.css";

export default function Footer() {
  const icons = [
    <FaFacebook
      style={{ width: "32px", height: "32px", color: "var(--pattern-yellow)" }}
    />,
    <BiLogoInstagramAlt
      style={{ width: "32px", height: "32px", color: "var(--pattern-yellow)" }}
    />,
    <RiGlobalFill
      style={{ width: "32px", height: "32px", color: "var(--pattern-yellow)" }}
    />,
  ];

  const links = [
    "https://www.facebook.com/nuapepg.utfpr/?locale=pt_BR",
    "https://www.instagram.com/nuape_pg/",
    "https://www.utfpr.edu.br/estrutura/grad/contatos/ponta-grossa#departamento-de-educa--o---deped",
  ];
  return (
    <footer>
      <div className={style.footerTop}>
        <div className={style.footerCollumn}>
          <img
            src="/images/logo_nuape.svg"
            alt="Logo_Nuape"
            style={{ width: "92px" }}
          />
          <p className={style.footerText}>
            Esse sistema foi desenvolvido para tornar mais acessível e
            simplificado o contato dos estudantes com o Núcleo de Acompanhamento
            Psicopedagógico e Assistência Estudantil do campus Ponta Grossa
          </p>
        </div>
        <div className={style.footerCollumn}>
          <p className={style.footerTitle}>Contato</p>
          <ul>
            <li className={style.footerListItem}>
              <FaLocationDot
                style={{
                  width: "24px",
                  height: "24px",
                  color: "var(--pattern-yellow)",
                }}
              />
              <p className={style.footerText}>
                R. Doutor Washington Subtil Chueire, 330 - Jardim Carvalho,
                Ponta Grossa - PR, 84017-220
              </p>
            </li>
            <li className={style.footerListItem}>
              <TbMailFilled
                style={{
                  width: "24px",
                  height: "24px",
                  color: "var(--pattern-yellow)",
                }}
              />
              <p className={style.footerText}>nuape-pg@utfpr.edu.br</p>
            </li>
            <li className={style.footerListItem}>
              <FaPhoneAlt
                style={{
                  width: "24px",
                  height: "24px",
                  color: "var(--pattern-yellow)",
                }}
              />
              <p className={style.footerText}>(42) 3220-4826</p>
            </li>
          </ul>
        </div>
        <div className={style.footerCollumn}>
          <p className={style.footerTitle}>Nossas áreas</p>
          <ul>
            <li className={style.footerTextListItem}>Odontologia</li>
            <li className={style.footerTextListItem}>Pedagogia</li>
            <li className={style.footerTextListItem}>Psicologia</li>
            <li className={style.footerTextListItem}>Serviço social</li>
          </ul>
        </div>
        <div className={style.footerCollumn}>
          {icons.map((icon, index) => (
            <IconButton
              key={index}
              bgColor="secondaryYellow"
              link={links[index]}
            >
              {icon}
            </IconButton>
          ))}
        </div>
      </div>
      <div className="bottom">
        <p className={style.footerCopyright}>
          ©️ 2024 Copyright - Ricardo Antonio Rebelo Junior
        </p>
      </div>
    </footer>
  );
}
