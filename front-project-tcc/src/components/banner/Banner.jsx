import style from "./style.module.css";
import React from "react";
import { Link } from "react-router-dom";
export default function Banner() {
  return (
    <section className={style.bannerContainer}>
      <div className={style.bannerContent}>
        <h1 className={style.bannerTitle}>
          O bem-estar dos alunos é nossa prioridade
        </h1>
        <p className={style.bannerDescription}>
          Agende uma reunião com o NUAPE e obtenha o apoio de que precisa.
          Estamos aqui para te ajudar a superar obstáculos acadêmicos e
          emocionais
        </p>
        <Link to="/scheduling">
          <button className="btn-filed-purple">Agende uma reunião</button>
        </Link>
      </div>
      <div className={style.bannerContent}>
        <img
          src="/images/image_banner.svg"
          alt="imagem_banner_home"
          style={{ width: "552px", height: "552px" }}
        />
      </div>
    </section>
  );
}
