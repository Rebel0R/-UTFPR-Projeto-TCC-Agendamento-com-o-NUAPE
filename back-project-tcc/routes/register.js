const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-db");
const { encryptPassword } = require("../utils/encryption");

//Cadastro de aluno
router.post("/student", async (req, res) => {
  console.log("----- Cadastro de usuário -----\n");
  try {
    const encryptedPassword = await encryptPassword(req.body.password);

    const studentRegister = {
      fullname: req.body.fullname,
      academicRecord: req.body.academicRecord,
      phone: req.body.phone,
      email: req.body.email,
      password: encryptedPassword,
      area: req.body.course,
      creationDate: new Date().toISOString(),
      profilePicture: "",
      typeAccount: "student",
    };

    const firestore = admin.firestore();

    // Verificar se já existe um usuário com o academicRecord fornecido
    const studentQuery = await firestore
      .collection("scheduling-nuape/users/students")
      .where("academicRecord", "==", req.body.academicRecord)
      .get();

    const professionalQuery = await firestore
      .collection("scheduling-nuape/users/professionals")
      .where("academicRecord", "==", req.body.academicRecord)
      .get();

    if (!studentQuery.empty || !professionalQuery) {
      console.log("Usuário já existente!");
      throw new Error("Já existe um usuário com este Registro Acadêmico!");
    }

    // Se não existir, inserir o novo estudante no banco de dados
    const studentRef = await firestore
      .collection("scheduling-nuape/users/students")
      .add(studentRegister);
    console.log("Novo estudante inserido com sucesso!");
    console.log("ID do novo estudante:", studentRef.id);
    console.log(studentRef);
    res.status(201).json({ message: "Estudante cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar estudante:", error.message);
    res.status(500).json({ message: error.message });
  }
});

//Cadastro de profissional
router.post("/professional", async (req, res) => {
  console.log("----- Cadastro de professional -----\n");
  try {
    const encryptedPassword = await encryptPassword(req.body.password);

    const professional = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      academicRecord: req.body.academicRecord,
      area: req.body.area,
      avaliableDays: req.body.avaliableDays,
      avaliableTimes: req.body.avaliableTimes,
      modality: req.body.modality,
      sessionDuration: req.body.sessionDuration,
      interval: req.body.interval,
      password: encryptedPassword,
      creationDate: new Date().toISOString(),
      advanceBooking: req.body.advanceBooking,
    };

    console.log(professional);

    const snapshot = await admin
      .firestore()
      .collection("scheduling-nuape/users/professionals")
      .where("academicRecord", "==", req.body.academicRecord)
      .get();

    if (!snapshot.empty) {
      console.log("Usuário já existente!");
      throw new Error("Já existe um usuário com este Registro Acadêmico!");
    }
    // Se não existir, inserir o novo profissional no Firestore
    const newProfessionalRef = await admin
      .firestore()
      .collection("scheduling-nuape/users/professionals")
      .add(professional);

    console.log("Novo profissional inserido com sucesso!");
    console.log("ID do novo profissional:", newProfessionalRef.id);
    res.status(201).json({ message: "Profissional cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar profissional:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
