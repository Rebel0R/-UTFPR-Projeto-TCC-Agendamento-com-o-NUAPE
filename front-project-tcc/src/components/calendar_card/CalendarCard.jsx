import InfoProfessional from "./info_professional/InfoProfessional";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style.module.css";
import CalendarSlots from "./calendar_slots/CalendarSlots";
import api from "../../api";
import Loading from "../loading/Loading";
import { decodeToken } from "react-jwt";
import { toast } from "react-toastify";

export default function CalendarCard({ professional }) {
  const { id, fullname, area, modality, email, sessionDuration } = professional;
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [typeAccount, setTypeAccount] = useState(null);
  const [existToken, setExistToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken);
    const decodedToken = decodeToken(currentToken);
    setExistToken(!!currentToken);
    if (currentToken && decodedToken) {
      const tokenIssuedAt = decodedToken.iat;
      const expirationDurationInSeconds = 2 * 60 * 60;
      const currentTimeInSeconds = Date.now() / 1000;
      const tokenExpirationTime = tokenIssuedAt + expirationDurationInSeconds;
      if (currentTimeInSeconds >= tokenExpirationTime) {
        toast.warn("Parece que sua sessão expirou. Realize o login novamente!");
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
      } else {
        setUserId(decodedToken.userId);
        setTypeAccount(decodedToken.typeAccount);
      }
    } else {
      setUserId(null);
      setTypeAccount(null);
    }
  }, [token]);

  const carouselRef = useRef(null);

  const prevSlide = (event) => {
    event.preventDefault();
    carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth;
  };

  const nextSlide = (event) => {
    event.preventDefault();
    carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
  };

  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`professionals/${id}`)
      .then((response) => {
        setSessions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro:", error.message);
        toast.error(error.response.data.error);
      });
  }, [professional]);

  return (
    <div className={style.calendarCardContainer}>
      <InfoProfessional
        avatar={fullname.substring(0, 2).toUpperCase()}
        fullname={fullname}
        area={area.charAt(0).toUpperCase() + area.slice(1).toLowerCase()}
        email={email}
        sessionDuration={sessionDuration}
        inPerson={modality.inPerson}
        remote={modality.remote}
      />
      <div className={style.carousselContainer}>
        {loading === true ? (
          <>
            <Loading />
          </>
        ) : (
          <>
            <button className={style.navButton} onClick={prevSlide}>
              <IoIosArrowBack style={{ width: "1rem", maxHeight: "1rem" }} />
            </button>
            <CalendarSlots
              professional={professional}
              carouselRef={carouselRef}
              sessions={sessions}
              existToken={existToken}
              token={token}
              idUser={userId}
              typeAccount={typeAccount}
            />
            <button className={style.navButton} onClick={nextSlide}>
              <IoIosArrowForward style={{ width: "1rem", height: "1rem" }} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
