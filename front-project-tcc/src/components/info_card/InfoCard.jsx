import style from "./style.module.css";
import React, { useState } from "react";

export default function InfoCard({
  avatar,
  nameProfessional,
  area,
  onClick,
  isSelected,
}) {
  return (
    <div
      className={`${style.cardInfos} ${isSelected ? style.selected : ""}`}
      onClick={onClick}
    >
      <div className={style.cardAvatar}>{avatar}</div>
      <div>
        <p className={style.nameProfessionalText}>{nameProfessional}</p>
        <p className={style.areaProfessionalText}>{area}</p>
      </div>
    </div>
  );
}
