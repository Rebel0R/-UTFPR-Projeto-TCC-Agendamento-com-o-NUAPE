import style from "./style.module.css";
import { MdMailOutline, MdAccessTime } from "react-icons/md";

export default function InfoProfessional({
  avatar,
  fullname,
  area,
  email,
  sessionDuration,
  inPerson,
  remote,
}) {
  return (
    <div className={style.boxSectionProfessional}>
      <div className={style.topContainer}>
        <div className={style.avatarIcon}>{avatar}</div>
        <div>
          <p className={style.nameProfessionalTitle}>{fullname}</p>
          <p className={style.areaProfessionalText}>{area}</p>
        </div>
      </div>
      <div style={style.contentPressionalAllText}>
        <p className={style.contentProfessionalText}>
          <MdMailOutline style={{ width: "1rem", height: "1rem" }} />
          {email}
        </p>
        <p className={style.contentProfessionalText}>
          <MdAccessTime style={{ width: "1rem", height: "1rem" }} /> A sessão
          tem duração de: <strong>{sessionDuration} minutos</strong>
        </p>
      </div>

      <div className={style.botContainer}>
        {inPerson && (
          <div className={style.boxModality}>
            <p className={style.textModalityTitle}>Presencial</p>
            <p className={style.textModality}>
              As sessões presenciais acontecem no <strong>{inPerson}</strong>.
              Lembre-se de ser pontual.
            </p>
          </div>
        )}
        {remote && (
          <div className={style.boxModality}>
            <p className={style.textModalityTitle}>Remoto</p>
            <p className={style.textModality}>
              As sessões remotas são realizadas através do Google Meet. Após a
              conclusão do agendamento, você receberá um e-mail contento o link
              para a reunião.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
