import style from "./style.module.css";
import React, { useState, useEffect } from "react";
import InnerTitle from "../../components/inner_title/InnerTitle";
import Radio from "../../components/radio/Radio";
import InfoCard from "../../components/info_card/InfoCard";
import Loading from "../../components/loading/Loading";
import api from "../../api";
import CalendarCard from "../../components/calendar_card/CalendarCard";
import { toast } from "react-toastify";

export default function Scheduling() {
  const [selectedArea, setSelectedArea] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value.toUpperCase());
    setSelectedProfessional(null);
  };

  const handleInfoCardClick = (professional) => {
    setSelectedProfessional(professional);
  };

  const areasServices = [
    "Odontologia",
    "Psicologia",
    "Pedagogia",
    "Serviço social",
  ];

  useEffect(() => {
    if (selectedArea) {
      setLoading(true);
      api
        .get(`professionals?area=${selectedArea}`)
        .then((response) => {
          setProfessionals(response.data);
        })
        .catch((error) => {
          console.error("Erro:", error.message);
          toast.error(error.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedArea]);

  return (
    <main className={style.schedulingContainer}>
      <InnerTitle
        title="Realize seu agendamento"
        description="Selecione qual a área do profissional que deseja encontrar:"
      />
      <div className={style.radioBtnContent}>
        {areasServices.map((area) => (
          <Radio
            key={area}
            label={area}
            value={area}
            name="area"
            checked={selectedArea === area}
            onChange={handleAreaChange}
          />
        ))}
      </div>
      {loading === true ? (
        <Loading />
      ) : (
        <div className={style.cardsProfessionalContainer}>
          {professionals.length === 0 && selectedArea.length !== 0 ? (
            <p className={style.responseMessage}>
              Nenhum profissional encontrado
            </p>
          ) : (
            professionals.map((prof, index) => (
              <InfoCard
                key={index}
                avatar={prof.fullname.substring(0, 2).toUpperCase()}
                nameProfessional={prof.fullname}
                isSelected={selectedProfessional === prof}
                area={
                  prof.area.charAt(0).toUpperCase() +
                  prof.area.slice(1).toLowerCase()
                }
                onClick={() => handleInfoCardClick(prof)}
              />
            ))
          )}
        </div>
      )}

      <div className={style.schedulingProfessionalContainer}>
        {selectedProfessional && (
          <CalendarCard professional={selectedProfessional} />
        )}
      </div>
    </main>
  );
}
