import SessionCard from "../../../components/session_card/SessionCard";
import ModalSlider from "../../../components/modal_slider/ModalSlider";
import ModalBox from "../../../components/modal_box/ModalBox";
import Input from "../../../components/input/Input";
import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import api from "../../../api";
import { useLoaderData, Link, useNavigate } from "react-router-dom";
import { MdCancel, MdMailOutline, MdCheck } from "react-icons/md";
import { FaRegClock } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function Account() {
  const dataReceived = useLoaderData();
  const [sessions, setSessions] = useState({});
  const [isOpenSlider, setIsOpenSlider] = useState(false);
  const [isOpenModalBox, setIsOpenModalBox] = useState(false);
  const [isOpenModalConfirmBox, setIsOpenModalConfirmBox] = useState(false);
  const [sessionSelected, setSessionSelected] = useState({
    sessionData: null,
    sessionId: null,
  });
  const [verifyCompleteSession, setVerifyCompleteSession] = useState(false);
  const [dateSession, setDateSession] = useState({
    numberDay: "",
    dayWeek: "",
    nameMonth: "",
  });
  const [cancelReason, setCancelReason] = useState("");
  const [errors, setErrors] = useState({
    cancelReason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (dataReceived.sessions) {
      setSessions(dataReceived.sessions);
    }
  }, [dataReceived.sessions]);

  const handleCancelReasonChange = (event) => {
    setCancelReason(event.target.value);
  };

  const handleBlurCancelReason = (event) => {
    if (!event.target.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cancelReason: "O motivo do cancelamento da sessão é obrigatório",
      }));
    } else if (event.target.value.length > 120) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cancelReason:
          "O motivo do cancelamento da sessão deve conter menos de 120 caracteres",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cancelReason: "",
      }));
    }
  };

  function getNameDayOfWeekMonth(dataString) {
    const [year, month, day] = dataString.split("-").map(Number);

    const dateConver = new Date(year, month - 1, day);

    const daysWeek = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const nameDayWeek = daysWeek[dateConver.getDay()];
    const nameMonth = months[dateConver.getMonth()];

    return { day: day, nameDay: nameDayWeek, month: nameMonth };
  }

  const openSlider = () => {
    setIsOpenSlider(true);
  };

  const closeSlider = () => {
    setIsOpenSlider(false);
    setSessionSelected({ sessionData: null, sessionId: null });
  };

  const openModalBox = () => {
    setIsOpenModalBox(true);
  };

  const closeModalBox = () => {
    setIsOpenModalBox(false);
  };

  const openModalConfirmBox = () => {
    setIsOpenModalConfirmBox(true);
  };

  const closeModalConfirmBox = () => {
    setIsOpenModalConfirmBox(false);
  };

  const handleSessionSelected = (session, id) => {
    setSessionSelected({ sessionData: session, sessionId: id });

    if (session.date) {
      const { day, nameDay, month } = getNameDayOfWeekMonth(session.date);
      setDateSession({ nameDay: nameDay, dayWeek: day, nameMonth: month });

      const currentDate = new Date();
      const currentTimeString = currentDate.toTimeString().split(" ")[0];

      const sessionDate = new Date(session.date);
      const sessionStartTimeString = session.hour.start;

      if (
        currentDate > sessionDate ||
        (currentDate.toDateString() === sessionDate.toDateString() &&
          currentTimeString >= sessionStartTimeString)
      ) {
        setVerifyCompleteSession(true);
      } else {
        setVerifyCompleteSession(false);
      }
    }
    openSlider();
  };

  const handleCancelSessionSelected = () => {
    if (errors.cancelReason || !cancelReason || cancelReason.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cancelReason: !cancelReason
          ? "O motivo do cancelamento da sessão é obrigatório"
          : errors.sessionReason,
      }));
      console.log("O motivo do cancelamento da sessão é obrigatório");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn(
        "Parece que sua sessão expirou. Por favor realize o login novamente!"
      );
      navigate("/login");
    }
    setIsSubmitting(true);
    const cancelSessionPromise = api.put(
      `session/${sessionSelected.sessionId}/cancel`,
      { cancelReason },
      {
        headers: { Authorization: token },
      }
    );
    toast
      .promise(cancelSessionPromise, {
        pending: "Cancelando sessão...",
        success: "Sessão cancelada com sucesso!",
      })
      .then((response) => {
        console.log(response.status);
        setIsSubmitting(false);
        setIsOpenModalBox(false);
        setIsOpenSlider(false);
        setCancelReason("");
        setSessions((prevSessions) => {
          const updatedSessions = { ...prevSessions };
          delete updatedSessions[sessionSelected.sessionId];
          return updatedSessions;
        });
        if (dataReceived.sessions) {
          delete dataReceived.sessions[sessionSelected.sessionId];
        } else {
          console.log("dataReceived.session não está definido");
        }
      })
      .catch((error) => {
        console.error("Erro durante o cancelamento de sessão:", error);
        toast.error(error.response.data.message);
      });
  };

  const handleConfirmSessionSelected = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn(
        "Parece que sua sessão expirou. Por favor realize o login novamene"
      );
      navigate("/login");
    }
    setIsSubmitting(true);
    const completeSessionPromise = api.put(
      `session/${sessionSelected.sessionId}/complete`,
      {},
      {
        headers: { Authorization: token },
      }
    );
    toast
      .promise(completeSessionPromise, {
        pending: "Finalizando sessão...",
        success: "Sessão finalizada com sucesso!",
      })
      .then((response) => {
        console.log(response.status);
        setIsSubmitting(false);
        setIsOpenModalConfirmBox(false);
        setIsOpenSlider(false);
        setSessions((prevSessions) => {
          const updatedSessions = { ...prevSessions };
          delete updatedSessions[sessionSelected.sessionId];
          return updatedSessions;
        });
        if (dataReceived.sessions) {
          delete dataReceived.sessions[sessionSelected.sessionId];
        } else {
          console.log("dataReceived.session não está definido");
        }
      })
      .catch((error) => {
        console.error("Erro durante o cancelamento de sessão:", error);
        toast.error(error.response.data.error);
      });
  };

  return (
    <>
      <div className={style.sessionContent}>
        <h1>Suas sessões</h1>
        <div className={style.cardsSessionsWrap}>
          {Object.keys(sessions).length === 0 ? (
            <div className={style.cardSessionEmptyContent}>
              <img
                src="/images/img-calendar.svg"
                alt="Imagem do calendário"
                className={style.imgCardSessionEmpty}
              />
              {dataReceived.typeAccount === "student" ? (
                <>
                  <p className={style.cardSessionEmptyText}>
                    Poxa, parece que você ainda não agendou nenhuma sessão. Que
                    tal fazer isso agora?
                  </p>
                  <Link to="/scheduling" className={style.cardSessionEmptyLink}>
                    <button className="btn-filed-yellow">Agendar sessão</button>
                  </Link>
                </>
              ) : (
                <>
                  <p className={style.cardSessionEmptyText}>
                    Parece que nenhuma sessão ainda foi agendada.
                  </p>
                </>
              )}
            </div>
          ) : (
            Object.entries(sessions).map(([sessionId, sessionData], index) => (
              <div key={sessionId + "" + "Item" + index}>
                <SessionCard
                  idSession={sessionId}
                  titleSession={sessionData.sessionTitle}
                  modality={
                    sessionData.modality.substring(0, 1) +
                    sessionData.modality.substring(1).toLowerCase()
                  }
                  date={sessionData.date}
                  hour={`${sessionData.hour.start} - ${sessionData.hour.end}`}
                  clickBtn={() => handleSessionSelected(sessionData, sessionId)}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <ModalSlider isOpen={isOpenSlider} onClose={closeSlider}>
        <div className={style.modalSliderSessionDate}>
          <h1>{dateSession.nameDay} &bull;</h1>
          <p>
            {dateSession.dayWeek} {dateSession.nameMonth}
          </p>
        </div>

        {sessionSelected.sessionData && (
          <div className={style.modalSliderSessionContent}>
            <h2>{sessionSelected.sessionData.sessionTitle}</h2>
            <div className={style.modalSliderSessionCaption}>
              <p>
                {sessionSelected.sessionData.courseStudent.substring(0, 1) +
                  sessionSelected.sessionData.courseStudent
                    .substring(1)
                    .toLowerCase()}
              </p>
              <p id={style.modalSliderSmallText}>
                {sessionSelected.sessionData.coursePeriod}
              </p>
            </div>
            <div className={style.modalSliderSessionCaption}>
              <p className="tag-content-info" id="tag-content-info-yellow">
                {sessionSelected.sessionData.modality.substring(0, 1) +
                  sessionSelected.sessionData.modality
                    .substring(1)
                    .toLowerCase()}
              </p>
              <p
                className={style.alignTextModalSlider}
                id={style.modalSliderSmallText}
              >
                <FaRegClock />
                {sessionSelected.sessionData.hour.start} -{" "}
                {sessionSelected.sessionData.hour.end}
              </p>
            </div>
            <p
              className={style.alignTextModalSlider}
              id={style.modalSliderSmallText}
            >
              <strong>Registro acadêmico:</strong>{" "}
              {sessionSelected.sessionData.academicRecordStudent}
            </p>
            {dataReceived.typeAccount === "student" ? (
              <p
                className={style.alignTextModalSlider}
                id={style.modalSliderSmallText}
              >
                <MdMailOutline /> <strong>E-mail prof.:</strong>{" "}
                {sessionSelected.sessionData.emailProfessional}
              </p>
            ) : (
              <p
                className={style.alignTextModalSlider}
                id={style.modalSliderSmallText}
              >
                <MdMailOutline /> <strong>E-mail aluno:</strong>{" "}
                {sessionSelected.sessionData.emailStudent}
              </p>
            )}

            <div className={style.modalSliderReasonBox}>
              <p className={style.modalSliderReasonTitle}>Motivo da sessão:</p>
              <p>{sessionSelected.sessionData.reason}</p>
            </div>
          </div>
        )}

        {dataReceived.typeAccount === "student" ? (
          <button
            className="btn-filed-purple"
            onClick={() => {
              openModalBox();
            }}
          >
            <MdCancel style={{ width: "1.5rem", height: "1.5rem" }} /> Cancelar
            agendamento
          </button>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <button
              className={
                verifyCompleteSession === true
                  ? "btn-filed-yellow"
                  : "btn-disable"
              }
              disabled={verifyCompleteSession}
              onClick={() => {
                openModalConfirmBox();
              }}
            >
              <MdCheck style={{ width: "1.5rem", height: "1.5rem" }} /> Concluir
              sessão
            </button>
            <button
              className="btn-filed-purple"
              onClick={() => {
                openModalBox();
              }}
            >
              <MdCancel style={{ width: "1.5rem", height: "1.5rem" }} />{" "}
              Cancelar agendamento
            </button>
          </div>
        )}
      </ModalSlider>
      <ModalBox isOpen={isOpenModalBox} onClose={closeModalBox}>
        <h1>Cancelar agendamento?</h1>
        <p>
          Lamentamos saber que você precisa cancelar sua sessão agendada. Por
          favor, informe o motivo do cancelamento e depois clique em "Cancelar
          agendamento".
        </p>
        <Input
          label="Motivo do cancelamento"
          type="text"
          name="cancelReason"
          required={true}
          value={cancelReason}
          onChange={handleCancelReasonChange}
          onBlur={handleBlurCancelReason}
          error={errors.cancelReason}
        />
        <button
          className="btn-filed-purple"
          onClick={() => {
            handleCancelSessionSelected();
          }}
          disabled={isSubmitting}
        >
          Cancelar agendamento
        </button>
        <button className="btn-text" onClick={closeModalBox}>
          Voltar
        </button>
      </ModalBox>
      <ModalBox isOpen={isOpenModalConfirmBox} onClose={closeModalConfirmBox}>
        <h1>Deseja concluir essa sessão?</h1>
        <p>Ao clicar em "Concluir sessão" ela será assumida como concluída.</p>
        <button
          className="btn-filed-purple"
          onClick={() => {
            handleConfirmSessionSelected();
          }}
          disabled={isSubmitting}
        >
          Confirmar sessão
        </button>
        <button className="btn-text" onClick={closeModalConfirmBox}>
          Voltar
        </button>
      </ModalBox>
    </>
  );
}
