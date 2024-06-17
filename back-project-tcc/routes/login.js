const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-db");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/encryption");
const {
  validateAcademicRecord,
  validatePassword,
} = require("../utils/validations");

//login
router.post("/", async (req, res) => {
  console.log("----- Login -----\n");
  try {
    const { academicRecord, password } = req.body;

    const academicRecordError = validateAcademicRecord(academicRecord);
    const passwordError = validatePassword(password);

    if (academicRecordError || passwordError) {
      throw new Error("Registro acadêmico ou senha inválidos");
    }

    const firestore = admin.firestore();

    // Consultar na coleção de estudantes
    const studentQuery = await firestore
      .collection("scheduling-nuape/users/students")
      .where("academicRecord", "==", academicRecord)
      .get();
    const studentDocs = studentQuery.docs;

    // Consultar na coleção de profissionais se não houver resultado na coleção de estudantes
    if (studentDocs.length === 0) {
      const professionalQuery = await firestore
        .collection("scheduling-nuape/users/professionals")
        .where("academicRecord", "==", academicRecord)
        .get();
      const professionalDocs = professionalQuery.docs;

      if (professionalDocs.length === 0) {
        throw new Error("Usuário não encontrado em nosso banco");
      }

      const professionalData = professionalDocs[0].data();

      if (!(await comparePassword(password, professionalData.password))) {
        console.log("As senhas não conferem");
        throw new Error("Senha inválida, por favor tente novamente");
      }

      const token = jwt.sign(
        {
          userId: professionalDocs[0].id,
          userName: professionalData.fullname,
          typeAccount: professionalData.typeAccount,
        },
        "pugftrn uapet-p"
      );
      const expirationTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
      console.log(
        `Login realizado com sucesso para o profissional: ${professionalData.fullname}\nToken: ${token} - Expira em: ${expirationTime}`
      );
      return res.status(200).json({ token });
    }

    const studentData = studentDocs[0].data();
    console.log(studentData);

    if (!(await comparePassword(password, studentData.password))) {
      console.log("As senhas não conferem");
      throw new Error("Senha inválida, por favor tente novamente");
    }

    const token = jwt.sign(
      {
        userId: studentDocs[0].id,
        userName: studentData.fullname,
        typeAccount: studentData.typeAccount,
      },
      "pugftrn uapet-p",
      { expiresIn: "2h" }
    );
    const expirationTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    console.log(
      `Login realizado com sucesso para o estudante: ${studentData.fullname}\nToken: ${token} - Expira em: ${expirationTime}`
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("Erro durante o login:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
