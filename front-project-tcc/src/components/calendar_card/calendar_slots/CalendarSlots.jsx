import ModalBox from "../../modal_box/ModalBox";
import style from "./style.module.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../input/Input";
import Select from "../../select/Select";
import api from "../../../api";
import { toast } from "react-toastify";

const CalendarSlots = ({
  professional,
  carouselRef,
  sessions,
  existToken,
  idUser,
  token,
  typeAccount,
}) => {
  const {
    id,
    fullname,
    avaliableDays,
    avaliableTimes,
    interval,
    sessionDuration,
    advanceBooking,
    modality,
  } = professional;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState({
    time: null,
    day: null,
    month: null,
    year: null,
  });
  const navigate = useNavigate();

  const [coursePeriod, setCoursePeriod] = useState("");
  const [sessionReason, setSessionReason] = useState("");
  const [modalityProfessional, setModalityProfessional] = useState("");
  const [errors, setErrors] = useState({
    coursePeriod: "",
    sessionReason: "",
    modalityProfessional: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCoursePeriodChange = (event) => {
    setCoursePeriod(event.target.value);
  };

  const handleSessionReasonChange = (event) => {
    setSessionReason(event.target.value);
  };

  const handleBlurSessionReason = (event) => {
    if (!event.target.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sessionReason: "O motivo da sessão é obrigatório",
      }));
    } else if (event.target.value.length > 120) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sessionReason: "O motivo da sessão deve conter menos de 120 caracteres",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sessionReason: "",
      }));
    }
  };

  const handleModalityProfessionalChange = (event) => {
    setModalityProfessional(event.target.value);
  };

  const handleBlurModalityProfessional = (event) => {
    if (!event.target.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modalityProfessional: "A modalidade da sessão deve ser selecionada",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        modalityProfessional: "",
      }));
    }
  };

  const handleTagHourButtonClick = (time, day, month, year) => {
    setSelectedDateTime({
      time: time,
      day: day,
      month: month,
      year: year,
    });
    setIsOpen(true);
  };

  const closeModal = () => {
    setCoursePeriod("");
    setSessionReason("");
    setModalityProfessional("");
    setIsOpen(false);
  };

  const handleConfirmScheduleButtonClick = (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    if (
      errors.sessionReason ||
      errors.modalityProfessional ||
      !sessionReason ||
      !modalityProfessional
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sessionReason: !sessionReason
          ? "O motivo da sessão é obrigatório"
          : errors.sessionReason,
        modalityProfessional: !modalityProfessional
          ? "A modalidade da sessão é obrigatória"
          : errors.modalityProfessional,
      }));
      return;
    }

    const startTime = new Date();
    startTime.setHours(parseInt(selectedDateTime.time.substring(0, 2)));
    startTime.setMinutes(parseInt(selectedDateTime.time.substring(3)));

    const endTime = new Date(startTime.getTime() + sessionDuration * 60000);
    const endTimeString = `${endTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}`;
    const dateSession = `${selectedDateTime.year}-${selectedDateTime.month}-${selectedDateTime.day}`;
    const sessionCreated = {
      idProfessional: id,
      idStudent: idUser,
      coursePeriod: coursePeriod,
      modality: modalityProfessional,
      date: dateSession,
      hour: {
        start: selectedDateTime.time,
        end: endTimeString,
      },
      reason: sessionReason,
      statusSession: "pending",
    };

    const schedulePromise = api.post("session", sessionCreated, {
      headers: { Authorization: token },
    });

    toast
      .promise(schedulePromise, {
        pending: "Agendando sessão...",
        success:
          "Nova sessão agendada com sucesso! Verifique sua caixa de entrada no e-mail ou em spam!",
      })
      .then((response) => {
        console.log(response.status);
        setIsSubmitting(false);
        navigate(`/account/${idUser}`);
      })
      .catch((error) => {
        console.log("Erro:", error.message);
        setIsSubmitting(false);
        toast.error(error.response.data.error);
      });
  };

  const getCurrentDayOfWeek = (value) => {
    const dayWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayWeek[value];

    return dayName;
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return months[monthNumber - 1];
  };

  const renderAvailableSlots = (dayIndex) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + dayIndex);

    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentDayOfWeek = getCurrentDayOfWeek(currentDate.getDay()); // Retorna um número de 0 (Domingo) a 6 (Sábado)
    const dayWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    // Verifica se o dia está disponível
    if (!avaliableDays[currentDayOfWeek]) {
      return (
        <div
          className={style.containerUnavailableDaysItem}
          key={dayIndex + "utfpr-pg"}
        >
          <div
            className={`${style.headerAvaliableDay} ${style.headerUnavailableDay}`}
          >
            <p className={style.headerAvDayTitle}>{`${
              dayWeek[currentDate.getDay()]
            }`}</p>
            <p className={style.headerAvDayNumber}>{currentDay}</p>
          </div>
        </div>
      );
    }

    const startTime = new Date(
      currentDate.toDateString() + " " + avaliableTimes[currentDayOfWeek].start
    );
    const endTime = new Date(
      currentDate.toDateString() + " " + avaliableTimes[currentDayOfWeek].end
    );

    const intervalStart = new Date(
      currentDate.toDateString() + " " + interval.start
    );
    const intervalEnd = new Date(
      currentDate.toDateString() + " " + interval.end
    );
    const slots = [];
    let keyCounter = 0;

    const scheduledTimes = new Set(
      sessions
        .filter((session) => {
          const sessionDate = new Date(session.date)
            .toISOString()
            .split("T")[0];
          const currentDate = new Date(
            `${currentYear}-${currentMonth}-${currentDay}`
          )
            .toISOString()
            .split("T")[0];
          const condition1 = sessionDate === currentDate;
          const condition2 = session.statusSession === "pending";
          return condition1 && condition2;
        })
        .map((session) => {
          const startTime = session.hour.start;
          return startTime;
        })
    );

    const bookingLimitDate = new Date();
    bookingLimitDate.setHours(bookingLimitDate.getHours() + advanceBooking);

    const isWithinBookingLimit = currentDate < bookingLimitDate;
    const isDisabledLimitDate = isWithinBookingLimit && dayIndex === 0;
    for (
      let time = startTime;
      time < endTime;
      time.setMinutes(time.getMinutes() + sessionDuration)
    ) {
      if (
        time < intervalStart &&
        intervalStart - time < sessionDuration * 60 * 1000
      ) {
        continue;
      }
      if (time < endTime && endTime - time < sessionDuration * 60 * 1000) {
        continue;
      }

      if (time >= intervalStart && time < intervalEnd) {
        time.setHours(intervalEnd.getHours());
        time.setMinutes(intervalEnd.getMinutes());
      }

      const hour = time.getHours();
      const minute = time.getMinutes();
      const slotTime = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      const isSessionScheduled = scheduledTimes.has(slotTime);

      const keyUnique = `${currentYear}${currentMonth}-${currentDay}-${hour}-${minute}-${keyCounter}`;
      slots.push(
        <li key={keyUnique} className={style.slotsItemHour}>
          <button
            className={`${style.tagHour} ${
              isSessionScheduled || isDisabledLimitDate
                ? style.tagHourDisable
                : style.tagHourAble
            }`}
            onClick={() =>
              handleTagHourButtonClick(
                slotTime,
                currentDay,
                currentMonth,
                currentYear
              )
            }
            disabled={isSessionScheduled || isDisabledLimitDate}
          >
            {slotTime}
          </button>
        </li>
      );
      keyCounter++;
    }

    return (
      <div
        className={style.containerAvaliableDaysItem}
        key={dayIndex + "nuape"}
      >
        <div className={style.headerAvaliableDay}>
          <p className={style.headerAvDayTitle}>{`${
            dayWeek[currentDate.getDay()]
          }`}</p>
          <p className={style.headerAvDayNumber}>{currentDay}</p>
        </div>
        <div className={style.contentAvaliableHours} key={dayIndex + 100}>
          <ul id={style.slotsItemsHours} key={dayIndex}>
            {slots}
          </ul>
        </div>
      </div>
    );
  };
  let modalityOptions;
  if (modality.remote === true && modality.inPerson.length !== 0) {
    modalityOptions = [
      { value: "", label: "" },
      { value: "PRESENCIAL", label: "Presencial" },
      { value: "REMOTO", label: "Remoto" },
    ];
  } else if (modality.remote === false && modality.inPerson.length !== 0) {
    modalityOptions = [
      { value: "", label: "" },
      { value: "PRESENCIAL", label: "Presencial" },
    ];
  } else {
    modalityOptions = [
      { value: "", label: "" },
      { value: "REMOTO", label: "Remoto" },
    ];
  }

  return (
    <>
      <div className={style.calendarSlots} ref={carouselRef}>
        {[...Array(30)].map((_, index) => renderAvailableSlots(index))}
      </div>
      {existToken ? (
        typeAccount === "professional" ? (
          <ModalBox isOpen={isOpen} onClose={closeModal}>
            <h1>Ops! Parece que você é um profissional</h1>
            <p>
              Por enquanto um profissional do departamento não pode realizar um
              agendamento com outro profissional.
            </p>
          </ModalBox>
        ) : (
          <ModalBox isOpen={isOpen} onClose={closeModal}>
            <h1>Confirmar agendamento?</h1>
            <p>
              Você selecionou uma reunião com <strong>{fullname}</strong> no dia{" "}
              <strong>
                {selectedDateTime.day} de {getMonthName(selectedDateTime.month)}
                , às {selectedDateTime.time}
              </strong>
              .
            </p>
            <Select
              label="Perido do curso"
              name="coursePeriod"
              value={coursePeriod}
              options={[
                { value: "", label: "" },
                { value: "1º Período", label: "1º Período" },
                { value: "2º Período", label: "2º Período" },
                { value: "3º Período", label: "3º Período" },
                { value: "4º Período", label: "4º Período" },
                { value: "5º Período", label: "5º Período" },
                { value: "6º Período", label: "6º Período" },
                { value: "7º Período", label: "7º Período" },
                { value: "8º Período", label: "8º Período" },
                { value: "9º Período", label: "9º Período" },
                { value: "10º Período", label: "10º Período" },
              ]}
              onChange={handleCoursePeriodChange}
              error={errors.coursePeriod}
            />
            <Input
              label="Motivo da sessão"
              name="sessionReason"
              type="text"
              value={sessionReason}
              onChange={handleSessionReasonChange}
              onBlur={handleBlurSessionReason}
              error={errors.sessionReason}
              required={true}
            />
            <Select
              label="Modalidade"
              name="modalityProfessional"
              value={modalityProfessional}
              options={modalityOptions}
              onChange={handleModalityProfessionalChange}
              onBlur={handleBlurModalityProfessional}
              error={errors.modalityProfessional}
              required={true}
            />
            <button
              className="btn-filed-purple"
              onClick={handleConfirmScheduleButtonClick}
              disabled={isSubmitting}
            >
              Confirmar agendamento
            </button>
            <button className="btn-text" onClick={closeModal}>
              Cancelar
            </button>
          </ModalBox>
        )
      ) : (
        <ModalBox isOpen={isOpen} onClose={closeModal}>
          <h1>Parece que você não está logado</h1>
          <p>
            Para agendar uma sessão, é necessário fazer login em sua conta. Se
            você já possui uma conta, faça login agora para continuar. Caso
            contrário, clique em "Criar conta" para cadastrar-se e agendar sua
            consulta.
          </p>
          <Link to="/login">
            <button className="btn-filed-purple">Fazer login</button>
          </Link>
          <Link to="/register">
            <button className="btn-text">Criar conta</button>
          </Link>
        </ModalBox>
      )}
    </>
  );
};

export default CalendarSlots;
