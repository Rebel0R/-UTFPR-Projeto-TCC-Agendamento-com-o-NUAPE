import { useLoaderData, useNavigate } from "react-router-dom";
import Input from "../../../components/input/Input";
import Select from "../../../components/select/Select";
import style from "./style.module.css";
import { IoAlertCircle } from "react-icons/io5";
import { useState, useEffect } from "react";
import {
  validateAcademicRecord,
  validateCoursePeriod,
  validateReason,
  validateDate,
  validateHour,
  validateModality,
} from "../../../utils/formvalidations";
import api from "../../../api";
import { toast } from "react-toastify";

const getDayOfWeek = (date) => {
  const dayOfWeek = new Date(date).getDay();

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return days[dayOfWeek];
};

export default function AccountManualScheduling() {
  const dataReceived = useLoaderData();
  const navigate = useNavigate();

  const [formSession, setFormSession] = useState({
    academicRecordStudent: "",
    coursePeriod: "",
    reason: "",
    date: "",
    hourStart: "",
    hourEnd: "",
    modality: "",
  });

  const [dayAvaliability, setDayAvaliability] = useState(false);
  const [daySelected, setDaySelected] = useState(false);
  const [avaliableTimeSlots, setAvaliableTimeSlots] = useState([]);

  const [errors, setErrors] = useState({
    academicRecordStudent: "",
    coursePeriod: "",
    reason: "",
    date: "",
    hourStart: "",
    modality: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  let modalityOptions;
  if (
    dataReceived.modality.remote === true &&
    dataReceived.modality.inPerson.length !== 0
  ) {
    modalityOptions = [
      { value: "", label: "" },
      { value: "PRESENCIAL", label: "Presencial" },
      { value: "REMOTO", label: "Remoto" },
    ];
  } else if (
    dataReceived.modality.remote === false &&
    dataReceived.modality.inPerson.length !== 0
  ) {
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

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setFormSession({
      ...formSession,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
    const selectedDate = value;
    const selectedDayOfWeek = getDayOfWeek(selectedDate);
    setDaySelected(selectedDayOfWeek);

    if (dataReceived.avaliableDays[selectedDayOfWeek]) {
      setDayAvaliability(true);
    } else {
      setDayAvaliability(false);
      setErrors({
        ...errors,
        [name]: "Dia indisponível definido pelo profissional",
      });
    }
  };

  useEffect(() => {
    if (dayAvaliability) {
      const availableSlots = calculateAvailableTimeSlots();
      setAvaliableTimeSlots(availableSlots);
    } else {
      setAvaliableTimeSlots([]);
    }
  }, [dayAvaliability]);

  const isWithinInterval = (time, intervalStart, intervalEnd) => {
    const [hour, minute] = time.split(":").map(Number);
    const [startHour, startMinute] = intervalStart.split(":").map(Number);
    const [endHour, endMinute] = intervalEnd.split(":").map(Number);

    const timeInMinutes = hour * 60 + minute;
    const intervalStartInMinutes = startHour * 60 + startMinute;
    const intervalEndInMinutes = endHour * 60 + endMinute;

    return (
      timeInMinutes >= intervalStartInMinutes &&
      timeInMinutes < intervalEndInMinutes
    );
  };

  const calculateAvailableTimeSlots = () => {
    const { start, end } = dataReceived.avaliableTimes[daySelected];
    const sessionDuration = dataReceived.sessionDuration;
    const { start: intervalStart, end: intervalEnd } = dataReceived.interval;

    const [endHourStr, endMinuteStr] = intervalEnd.split(":").map(Number);
    const intervalEndInMinutes = endHourStr * 60 + endMinuteStr;

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let currentTime = startHour * 60 + startMinute;
    let check = 0;

    const availableTimeSlots = [];

    while (currentTime < endHour * 60 + endMinute) {
      const hour = Math.floor(currentTime / 60);
      const minute = currentTime % 60;
      const hourLabel = `${String(hour).padStart(2, "0")}:${String(
        minute
      ).padStart(2, "0")}`;

      if (isWithinInterval(hourLabel, intervalStart, intervalEnd)) {
        currentTime += sessionDuration;

        continue;
      } else if (check === 0 && currentTime >= intervalEndInMinutes) {
        currentTime = intervalEndInMinutes;
        check += 1;
        continue;
      }

      availableTimeSlots.push({ value: hourLabel, label: hourLabel });
      currentTime += sessionDuration;
    }

    return availableTimeSlots;
  };

  const calculateEndTime = (startTime, sessionDuration) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);

    const durationHour = Math.floor(sessionDuration / 60);
    const durationMinute = sessionDuration % 60;

    let endHour = startHour + durationHour;
    let endMinute = startMinute + durationMinute;

    if (endMinute >= 60) {
      endHour++;
      endMinute -= 60;
    }

    const endTime = `${String(endHour).padStart(2, "0")}:${String(
      endMinute
    ).padStart(2, "0")}`;

    return endTime;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "hourStart") {
      setFormSession((prevFormSession) => ({
        ...prevFormSession,
        [name]: value,
        hourEnd: calculateEndTime(value, dataReceived.sessionDuration),
      }));
    } else {
      setFormSession({
        ...formSession,
        [name]: value,
      });
    }
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "academicRecordStudent":
        setErrors({
          ...errors,
          academicRecordStudent: validateAcademicRecord(value),
        });
        break;
      case "coursePeriod":
        setErrors({ ...errors, coursePeriod: validateCoursePeriod(value) });
        break;
      case "reason":
        setErrors({ ...errors, reason: validateReason(value) });
        break;
      case "date":
        setErrors({ ...errors, date: validateDate(value) });
        break;
      case "hour.start":
        setErrors({ ...errors, hour: validateHour(value) });
        break;
      case "modality":
        setErrors({ ...errors, modality: validateModality(value) });
        break;
      default:
        break;
    }
  };

  const handleSubmitFormSession = (ev) => {
    ev.preventDefault();
    setIsSubmitting(true);
    if (
      errors.academicRecordStudent ||
      errors.coursePeriod ||
      errors.reason ||
      errors.date ||
      errors.hourStart ||
      errors.modality ||
      formSession.academicRecordStudent.trim() === "" ||
      formSession.reason.trim() === "" ||
      formSession.date.trim() === "" ||
      formSession.hourStart.trim() === "" ||
      formSession.hourEnd.trim() === "" ||
      formSession.modality.trim() === ""
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        academicRecordStudent: !formSession.academicRecordStudent
          ? "O registro acadêmico é obrigatório"
          : errors.academicRecordStudent,
        coursePeriod: !formSession.coursePeriod
          ? "O número máximo de caractere é 120"
          : errors.coursePeriod,
        reason: !formSession.reason
          ? "O motivo da sessão é obrigatório"
          : errors.reason,
        date: !date ? "A data é obrigatória" : errors.date,
        hourStart: !formSession.hourStart
          ? "A hora é obrigatória"
          : errors.hourStart,
        modality: !formSession.modality
          ? "A modalidade da sessão é obrigatória"
          : errors.modality,
      }));
      console.log("O formulário está inválido");
      return;
    }

    const formSessionData = {
      idProfessional: dataReceived.id,
      academicRecordStudent: formSession.academicRecordStudent.trim(),
      coursePeriod: formSession.coursePeriod,
      reason: formSession.reason.trim(),
      date: formSession.date,
      hourStart: formSession.hourStart,
      hourEnd: formSession.hourEnd,
      modality: formSession.modality,
      statusSession: "pending",
    };
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn(
        "Parece que sua sessão expirou. Por favor, realize o login novamente"
      );
      navigate("/login");
    }

    const manualSchedulingPromise = api.post(
      "session/manual-scheduling",
      formSessionData,
      {
        headers: { Authorization: token },
      }
    );
    toast
      .promise(manualSchedulingPromise, {
        pending: "Realizando o agendamento manual da sessão...",
        success: "Agendamento realizado com sucesso!",
      })
      .then((response) => {
        console.log(response.status);
        navigate(`/account/${dataReceived.id}`);
      })
      .catch((error) => {
        console.error("Erro durante o agendamento:", error);
        toast.error(error.response.data.error);
      });
  };

  return (
    <div className={style.manualSchedulingContainer}>
      <div className={style.manualSchedulingContent}>
        <div className={style.manualSchedulingTitle}>
          <h1>Agendar sessão manualmente</h1>
          <p>Preencha os campos abaixo para realizar o agendamento manual</p>
        </div>
        <form
          className={style.manualSchedulingForm}
          onSubmit={handleSubmitFormSession}
        >
          <Input
            type="text"
            required={true}
            name="academicRecordStudent"
            label="Registro acadêmico"
            value={formSession.academicRecordStudent}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.academicRecordStudent}
          />
          <Select
            label="Período do curso"
            value={formSession.coursePeriod}
            name="coursePeriod"
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.coursePeriod}
            required={false}
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
          />
          <Input
            type="text"
            required={true}
            value={formSession.reason}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={errors.reason}
            name="reason"
            label="Motivo da sessão"
          />
          <div className={style.lineInputs}>
            <div className={style.inputContainer}>
              <div>
                <label>Data da sessão</label>
                <span id={style.inputRequired}>*</span>
              </div>
              <input
                type="date"
                required={true}
                name="date"
                value={formSession.date}
                onChange={handleDateChange}
                onBlur={handleBlur}
                className={`${errors.date ? "input-error" : "input-pattern"}`}
              />
              {errors.date && (
                <span className={style.inputErrorMessage}>
                  <IoAlertCircle
                    style={{
                      color: "var(--pattern-red)",
                      minWidth: "16px",
                      minHeight: "16px",
                      height: "16px",
                      margin: "0 0.25rem 0 0",
                    }}
                  />
                  {errors.date}
                </span>
              )}
            </div>
            {dayAvaliability && (
              <Select
                label="Horário da sessão"
                name="hourStart"
                required={true}
                value={formSession.hourStart}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.hour}
                options={avaliableTimeSlots}
              />
            )}

            <Select
              label="Modalidade"
              name="modality"
              value={formSession.modality}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors.modality}
              required={true}
              options={modalityOptions}
            />
          </div>

          <button type="submit" className="btn-filed-yellow">
            Agendar
          </button>
        </form>
      </div>
    </div>
  );
}
