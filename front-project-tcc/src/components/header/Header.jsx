import { Link } from "react-router-dom";
import style from "./style.module.css";
import { decodeToken } from "react-jwt";
import React, { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      setToken(currentToken);
      const decodedToken = decodeToken(currentToken);
      if (decodedToken) {
        const tokenIssuedAt = decodedToken.iat;
        const expirationDurationInSeconds = 2 * 60 * 60;

        const currentTimeInSeconds = Date.now() / 1000;
        const tokenExpirationTime = tokenIssuedAt + expirationDurationInSeconds;
        if (currentTimeInSeconds >= tokenExpirationTime) {
          toast.warn(
            "Parece que sua sessão expirou. Realize o login novamente!"
          );
          localStorage.removeItem("token");
          setToken(null);
          navigate("/login");
        } else {
          setUser(decodedToken.userName);
          setUserId(decodedToken.userId);
        }
      } else {
        setUser(null);
        setUserId(null);
      }
    } else {
      setToken(null);
      setUser(null);
      setUserId(null);
    }
  }, [token]);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = (event) => {
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
        setToken(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Erro durante o logout:", error);
        toast.error(error.response.data.error);
      });
  };

  return (
    <header>
      <nav className={style.navItems}>
        <img src="/images/logo_utfpr.svg" alt="Logo UTFPR" />
        <div className={style.linkItemsList}>
          <div className={style.allLinks}>
            <Link to="/" className={style.linkItem}>
              Home
            </Link>
            <a href="/#homeCardContainer" className={style.linkItem}>
              Quem somos
            </a>
            <a href="/#onboardingCardContainer" className={style.linkItem}>
              Passo a passo
            </a>
            <Link to="/scheduling" className={style.linkItem}>
              Agendamento
            </Link>
          </div>
          <div className={style.navButtons} onClick={handleMenuClick}>
            {!user ? (
              <>
                <Link to="/login">
                  <button className="btn-outline-yellow">Entrar</button>
                </Link>
                <Link to="/register">
                  <button className="btn-filed-yellow">Cadastre-se</button>
                </Link>
              </>
            ) : (
              <>
                <div className={style.navCircularContent}>
                  <p className={style.navTextabbreviation}>
                    {user.substring(0, 2).toUpperCase()}
                  </p>
                </div>
                <div className={style.navUserNameContent}>
                  <p className={style.navUserNameText}>Olá, </p>
                  <p className={`${style.navUserNameText} ${style.strongText}`}>
                    {user.split(" ")[0]}
                  </p>
                </div>
                {showMenu && (
                  <div className={style.dropdownMenu}>
                    <button
                      className={`btn-text ${style.grayText}`}
                      onClick={() => {
                        navigate(`/account/${userId}`);
                      }}
                    >
                      Minha conta
                    </button>
                    <hr />
                    <button
                      className={`btn-text ${style.grayText}`}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
