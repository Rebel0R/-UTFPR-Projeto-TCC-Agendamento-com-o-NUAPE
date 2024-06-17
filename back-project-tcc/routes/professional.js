const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-db");
const { decryptText } = require("../utils/encryption");

//Busca todos os profissionais de uma área
router.get("/", async (req, res) => {
  console.log("----- Busca de Profissionais -----");
  const { area } = req.query;
  console.log(area);

  try {
    const querySnapshot = await admin
      .firestore()
      .collection("scheduling-nuape/users/professionals")
      .where("area", "==", area)
      .get();

    const professionals = [];
    querySnapshot.forEach((doc) => {
      professionals.push({ id: doc.id, ...doc.data() });
    });

    const professionalsWithoutPassword = professionals.map((professional) => {
      const { password, ...professionalWithoutPassword } = professional;
      return professionalWithoutPassword;
    });

    console.log(professionalsWithoutPassword);
    res.status(200).json(professionalsWithoutPassword);
  } catch (error) {
    console.error("Erro ao buscar profissionais:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//Busca as consultas de um determinado profissional
router.get("/:idProfessional", async (req, res) => {
  console.log("----- Busca de Consultas Do Profissional-----");
  const idProfessional = req.params.idProfessional;

  try {
    const querySnapshot = await admin
      .firestore()
      .collection("scheduling-nuape/schedules/schedule")
      .where("idProfessional", "==", idProfessional)
      .where("statusSession", "==", "pending")
      .get();

    const allSessions = [];
    querySnapshot.forEach((doc) => {
      const sessionData = doc.data();
      sessionData.reason = decryptText(sessionData.reason, "pugftrn uapet-p");
      allSessions.push(sessionData);
    });

    console.log(allSessions);
    res.status(200).json(allSessions);
  } catch (error) {
    console.error("Erro ao buscar sessões agendadas:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
