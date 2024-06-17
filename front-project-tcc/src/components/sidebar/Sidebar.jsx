import style from "./style.module.css";
import { RiArrowGoBackFill } from "react-icons/ri";
import {
  MdOutlineLogout,
  MdOutlineCalendarToday,
  MdEdit,
} from "react-icons/md";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { decodeToken } from "react-jwt";
import api from "../../api";
import { toast } from "react-toastify";

export default function Sidebar({ abbrevUserName, userName, userArea }) {
  const location = useLocation();
  const decodedToken = decodeToken(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const logoutPromise = api.post("logout", null, {
      headers: { Authorization: token },
    });
    toast
      .promise(logoutPromise, {
        pending: "Realizando logout...",
        success: "Logout realizado com sucesso!",
      })
      .then((response) => {
        console.log(response.status);
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((error) => {
        console.error("Erro durante o logout:", error);
        toast.error(error.response.data.error);
      });
  };

  return (
    <nav className={style.sidebarHeader}>
      <div className={style.sidebarTopContent}>
        <div className={style.sidebarAvatar}>{abbrevUserName}</div>
        <p className={style.sidebarNameUser}>{userName}</p>
        <p className={style.sidebarOcupationUser}>{userArea}</p>
      </div>
      <div className={style.sidebarAllButtonsContent}>
        <div className={style.buttonsContentTop}>
          <Link to={`/account/${decodedToken.userId}`}>
            <button
              className={
                location.pathname === `/account/${decodedToken.userId}`
                  ? `btn-filed-yellow ${style.btnPattern}`
                  : `${style.btnOnlyText}`
              }
            >
              <MdOutlineCalendarToday
                style={{ width: "24px", height: "24px" }}
              />
              Minhas sessões
            </button>
          </Link>

          {decodedToken.typeAccount === "student" ? (
            <>
              <Link to="/">
                <button className={`${style.btnPattern} ${style.btnOnlyText}`}>
                  <RiArrowGoBackFill
                    style={{ width: "24px", height: "24px" }}
                  />
                  Voltar para a home
                </button>
              </Link>
            </>
          ) : decodedToken.typeAccount === "professional" ? (
            <>
              <Link to={`/account/${decodedToken.userId}/manual-scheduling`}>
                <button
                  className={
                    location.pathname ===
                    `/account/${decodedToken.userId}/manual-scheduling`
                      ? `btn-filed-yellow ${style.btnPattern}`
                      : `${style.btnOnlyText}`
                  }
                >
                  <MdEdit style={{ width: "24px", height: "24px" }} />
                  Agendar manualmente
                </button>
              </Link>
              <Link to="/">
                <button className={`${style.btnPattern} ${style.btnOnlyText}`}>
                  <RiArrowGoBackFill
                    style={{ width: "24px", height: "24px" }}
                  />
                  Voltar para a home
                </button>
              </Link>
            </>
          ) : null}
        </div>
        <button
          className={`${style.btnPattern} btn-filed-yellow`}
          onClick={handleLogout}
        >
          <MdOutlineLogout style={{ width: "24px", height: "24px" }} />
          Logout
        </button>
      </div>
    </nav>
  );
}
