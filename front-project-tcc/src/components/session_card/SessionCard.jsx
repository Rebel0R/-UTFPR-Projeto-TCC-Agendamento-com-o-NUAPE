import style from "./style.module.css";
import { FaRegClock, FaRegCalendar } from "react-icons/fa6";

export default function SessionCard({
  idSession,
  titleSession,
  modality,
  date,
  hour,
  clickBtn,
}) {
  return (
    <div className={style.cardSessionContainer}>
      <div>
        <p className={style.cardSessionTitle}>{titleSession}</p>
        <p className={style.cardSessionDescription}>{modality}</p>
      </div>
      <div>
        <p className={style.cardSessionDescription}>
          <FaRegCalendar />
          {date}
        </p>
        <p className={style.cardSessionDescription}>
          <FaRegClock />
          {hour}
        </p>
      </div>
      <button className="btn-inline" onClick={clickBtn}>
        Mais detalhes
      </button>
    </div>
  );
}
