const express = require("express");
const admin = require("../config/firebase-db");
const jwt = require("jsonwebtoken");
const router = express.Router();

//Responsável por realizar o logout de um usuário
router.post("/", async (req, res) => {
  console.log("-----LOGOUT-----");
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  let typeAccount;
  let userId;
  jwt.verify(token, "pugftrn uapet-p", (error, decoded) => {
    if (error) {
      console.error("Erro ao decodificar o token:", error.message);
      return res.status(401).json({ error: "Erro ao decodificar o token" });
    } else {
      console.log("Token decodificado:", decoded);

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
      throw new Error("Usuário não encontrado no banco");
    }

    res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro durante o logout:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
