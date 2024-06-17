const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-db");
const jwt = require("jsonwebtoken");
const { decryptText } = require("../utils/encryption");

//Busca os dados da conta e das sessões
router.get("/:id", async (req, res) => {
  console.log("--- MINHA CONTA ---");
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  let userId;
  let typeAccount;

  jwt.verify(token, "pugftrn uapet-p", (error, decoded) => {
    if (error) {
      console.error("Erro ao decodificar o token:", error.message);
      return res.status(401).json({ error: "Erro ao decodificar o token" });
    } else {
      console.log("Token decodificado:", decoded + "\n");

      if (decoded && decoded.typeAccount) {
        typeAccount = decoded.typeAccount;
        userId = decoded.userId;
      } else {
        console.log("Campo typeAccount não encontrado no token.");
        return res.status(401).json({ error: "Erro na estrutura do token" });
      }
    }
  });

  try {
    // Obtendo os dados do usuário
    const userDoc = await admin
      .firestore()
      .collection(
        typeAccount === "student"
          ? "scheduling-nuape/users/students"
          : "scheduling-nuape/users/professionals"
      )
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      throw new Error("Usuário não encontrado!");
    }

    // Remover o campo de senha dos dados do usuário
    const userData = userDoc.data();
    delete userData.password;
    delete userData.creationDate;

    // Consulta as sessões no Firestore
    const sessionSnapshot = await admin
      .firestore()
      .collection("scheduling-nuape/schedules/schedule")
      .where(
        typeAccount === "student" ? "idStudent" : "idProfessional",
        "==",
        userId
      )
      .where("statusSession", "==", "pending")
      .get();

    const sortedSessions = sessionSnapshot.docs
      .map((doc) => {
        const sessionData = doc.data();
        sessionData.dateObject = new Date(sessionData.date);
        sessionData.id = doc.id; // Adiciona o id do documento como uma propriedade "id" no objeto de sessão
        return sessionData;
      })
      .sort((a, b) => a.dateObject - b.dateObject);

    const sessions = sortedSessions.reduce((acc, sessionData) => {
      sessionData.reason = decryptText(sessionData.reason, "pugftrn uapet-p");
      acc[sessionData.id] = sessionData; // Usa o id como chave para manter a identidade de cada sessão
      return acc;
    }, {});

    const response = {
      id: userId,
      ...userData,
      sessions: sessions,
    };

    console.log("Usuário localizado: ", response.fullname);
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro durante a busca do usuário:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

//Busca os dados da conta
router.get("/:id/data", async (req, res) => {
  console.log("--- MINHA CONTA - Dados---");
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  let userId;
  let typeAccount;

  jwt.verify(token, "pugftrn uapet-p", (error, decoded) => {
    if (error) {
      console.error("Erro ao decodificar o token:", error.message);
      return res.status(401).json({ error: "Erro ao decodificar o token" });
    } else {
      console.log("Token decodificado:", decoded + "\n");

      if (decoded && decoded.typeAccount) {
        typeAccount = decoded.typeAccount;
        userId = decoded.userId;
      } else {
        console.log("Campo typeAccount não encontrado no token.");
        return res.status(401).json({ error: "Erro na estrutura do token" });
      }
    }
  });

  try {
    const userDoc = await admin
      .firestore()
      .collection(
        typeAccount === "student"
          ? "scheduling-nuape/users/students"
          : "scheduling-nuape/users/professionals"
      )
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      throw new Error("Usuário não encontrado!");
    }

    const userData = userDoc.data();
    delete userData.password;
    delete userData.creationDate;

    const response = {
      id: userId,
      ...userData,
    };

    console.log("Usuário localizado: ", response.fullname);
    console.log(JSON.stringify(response));
    res.status(200).json(response);
  } catch (error) {
    console.error("Erro durante a busca do usuário:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
