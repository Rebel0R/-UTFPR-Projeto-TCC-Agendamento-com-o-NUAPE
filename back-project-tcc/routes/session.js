const express = require("express");
const router = express.Router();
const admin = require("../config/firebase-db");
const jwt = require("jsonwebtoken");
const { validateDate, validateTime } = require("../utils/validations");
const { encryptText } = require("../utils/encryption");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: "587",
  secure: false,
  auth: {
    user: "tester.nuape@outlook.com",
    pass: "nuapepg2024",
  },
});

//cadastro de sessão pelo estudante
router.post("/", async (req, res) => {
  console.log("----- Cadastro de sessão -----\n");

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
        return res
          .status(401)
          .json({ error: "Campo typeAccount não encontrado no token." });
      }
    }
  });

  if (typeAccount === "professional") {
    return res.status(401).json({
      error:
        "Erro ao realizar um agendamento. Um profissional não pode agendar uma sessão com outro profissional.",
    });
  }

  const {
    idStudent,
    idProfessional,
    date,
    hour,
    modality,
    reason,
    coursePeriod,
    statusSession,
  } = req.body;

  console.log(req.body);

  if (idStudent !== userId) {
    return res
      .status(401)
      .json({ error: "Erro ao realizar um agendamento. ID inválido." });
  }

  if (modality === "" || reason === "") {
    return res.status(401).json({
      error:
        "Erro ao realizar um agendamento. O motivo da sessão e a modalidade devem ser preenchidos.",
    });
  }

  const dateError = validateDate(date);
  const timeStartError = validateTime(hour.start);
  const timeEndError = validateTime(hour.end);

  if (dateError || timeStartError || timeEndError) {
    console.log("Data ou horário inválido");
    return res.status(401).json({ error: "Data ou horários inválidos." });
  }

  if (statusSession !== "pending") {
    return res
      .status(401)
      .json({ error: "Status de sessão inválido ou inexistente." });
  }

  try {
    const firestore = admin.firestore();

    const studentQuery = await firestore
      .collection("scheduling-nuape/users/students")
      .doc(idStudent)
      .get();

    const professionalQuery = await firestore
      .collection("scheduling-nuape/users/professionals")
      .doc(idProfessional)
      .get();

    if (studentQuery.empty || professionalQuery.empty) {
      console.log("Usuário não encontrado");
      throw new Error("Usuário não encontrado em nosso banco de dados!");
    }

    const existingSessionsWithTheSameProfessional = await firestore
      .collection("scheduling-nuape/schedules/schedule")
      .where("idStudent", "==", idStudent)
      .where("idProfessional", "==", idProfessional)
      .where("date", "==", date)
      .where("hour.start", "==", hour.start)
      .where("hour.end", "==", hour.end)
      .where("statusSession", "==", "pending")
      .get();
    if (!existingSessionsWithTheSameProfessional.empty) {
      console.log("Já existe esse horário");
      throw new Error(
        "Já existe uma sessão agendada entre este aluno e profissional nesta data e horário."
      );
    }

    const existingSessionsWithTheSameDateHour = await firestore
      .collection("scheduling-nuape/schedules/schedule")
      .where("idStudent", "==", idStudent)
      .where("date", "==", date)
      .where("hour.start", "==", hour.start)
      .where("hour.end", "==", hour.end)
      .where("statusSession", "==", "pending")
      .get();
    if (!existingSessionsWithTheSameDateHour.empty) {
      console.log("Já existe esse horário");
      throw new Error(
        "Já existe uma sessão agendada com este aluno nesta data e horário."
      );
    }
    const reasonEcrypted = encryptText(reason, "pugftrn uapet-p");
    const firstNameStudent = studentQuery.data().fullname.split(" ")[0];
    const firstNameProfessional = professionalQuery
      .data()
      .fullname.split(" ")[0];
    const sessionTitle = `Reunião de ${firstNameStudent} com ${firstNameProfessional}`;
    const newSession = {
      sessionTitle: sessionTitle,
      coursePeriod: coursePeriod,
      idStudent: idStudent,
      idProfessional: idProfessional,
      date: date,
      hour: hour,
      modality: modality,
      reason: reasonEcrypted,
      statusSession: statusSession,
      academicRecordStudent: studentQuery.data().academicRecord,
      courseStudent: studentQuery.data().area,
      emailStudent: studentQuery.data().email,
      emailProfessional: professionalQuery.data().email,
      creationDate: new Date().toISOString(),
    };

    const newScheduleRef = await firestore
      .collection("/scheduling-nuape/schedules/schedule")
      .add(newSession);

    const dateFormated = new Date(newSession.date).toLocaleDateString("pt-BR");
    let descriptionEmailHtml;
    let descriptionEmailText;
    if (modality === "REMOTO") {
      descriptionEmailHtml = `<h4> Olá, tudo bem?</h4><p>Este e-mail é um lembrete para a sessão que você agendou com o profissional <strong>${
        professionalQuery.data().fullname
      }</strong> no dia ${dateFormated} às ${
        newSession.hour.start
      }</p><p>O link para a reunião é este: ${
        professionalQuery.data().linkMeet
      }</p><p>Para qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }</p><p>Tenha uma ótima sessão!</p>`;

      descriptionEmailText = `Olá, tudo bem?\nEste e-mail é um lembrete para a sessão que você agendou com o profissional ${
        professionalQuery.data().fullname
      } no dia ${dateFormated} às ${
        newSession.hour.start
      }\nO link para a reunião é este: ${
        professionalQuery.data().linkMeet
      }\n Para qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }\nTenha uma ótima sessão!`;
    } else {
      descriptionEmailHtml = `<h4> Olá, tudo bem?</h4><p>Este e-mail é um lembrete para a sessão que você agendou com o profissional <strong>${
        professionalQuery.data().fullname
      }</strong> no dia ${dateFormated} às ${
        newSession.hour.start
      }</p></br><p>Para qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }</p><p>Tenha uma ótima sessão!</p>`;

      descriptionEmailText = `Olá, tudo bem?\nEste e-mail é um lembrete para a sessão que você agendou com o profissional ${
        professionalQuery.data().fullname
      } no dia ${dateFormated} às ${
        newSession.hour.start
      }\nPara qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }\nTenha uma ótima sessão!`;
    }

    // transport.sendMail({
    //   from: "Agendamento de sessão - NUAPE-PG <tester.nuape@outlook.com>",
    //   to: `${newSession.emailStudent}, ${newSession.emailProfessional}`,
    //   subject: `${sessionTitle} - ${dateFormated} às ${newSession.hour.start}`,
    //   html: descriptionEmailHtml,
    //   text: descriptionEmailText,
    // });

    transport.sendMail(
      {
        from: "Agendamento de sessão - NUAPE-PG <tester.nuape@outlook.com>",
        to: `${newSession.emailStudent}, ${newSession.emailProfessional}`,
        subject: `${sessionTitle} - ${dateFormated} às ${newSession.hour.start}`,
        html: descriptionEmailHtml,
        text: descriptionEmailText,
      },
      (error) => {
        if (error) {
          console.error("Erro ao enviar e-mail:", error);
        }
      }
    );

    console.log("Nova sessão inserida com sucesso!");
    console.log("ID da nova sessão:", newScheduleRef.id);
    res.status(201).json({ message: "Sessão cadastrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar sessão:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

//cadastro de sessão pelo profissional (manual)
router.post("/manual-scheduling", async (req, res) => {
  console.log("----- Cadastro manual de sessão -----\n");

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
        return res
          .status(401)
          .json({ error: "Campo typeAccount não encontrado no token." });
      }
    }
  });

  if (typeAccount !== "professional") {
    return res.status(401).json({
      error:
        "Erro ao realizar um agendamento. Apenas um profissional pode realizar o agendamento manual",
    });
  }

  const {
    idProfessional,
    academicRecordStudent,
    date,
    hourStart,
    hourEnd,
    modality,
    reason,
    coursePeriod,
    statusSession,
  } = req.body;

  console.log(req.body);

  if (idProfessional !== userId) {
    return res
      .status(401)
      .json({ error: "Erro ao realizar o agendamento. ID inválido" });
  }

  if (modality === "" || reason === "") {
    return res.status(401).json({
      error:
        "Erro ao realizar o agendamento. O motivo da sessão e a modalidade devem ser preenchidos",
    });
  }

  const dateError = validateDate(date);
  const timeStartError = validateTime(hourStart);
  const timeEndError = validateTime(hourEnd);

  if (dateError || timeStartError || timeEndError) {
    console.log("Data ou horário inválido");
    return res.status(401).json({ error: "Data ou horários inválidos" });
  }

  if (statusSession !== "pending") {
    return res
      .status(401)
      .json({ error: "Status de sessão inválido ou inexistente" });
  }

  try {
    const firestore = admin.firestore();

    const studentQuery = await firestore
      .collection("scheduling-nuape/users/students")
      .where("academicRecord", "==", academicRecordStudent)
      .get();

    const professionalQuery = await firestore
      .collection("scheduling-nuape/users/professionals")
      .doc(idProfessional)
      .get();

    if (studentQuery.empty || professionalQuery.empty) {
      console.log("Usuário não encontrado");
      throw new Error("Usuário não encontrado em nosso banco de dados!");
    } else {
      console.log("Usuários encontrados");
    }
    const studentData = studentQuery.docs[0].data();
    const studentId = studentQuery.docs[0].id;

    const existingSessionsWithTheSameProfessional = await firestore
      .collection("scheduling-nuape/schedules/schedule")
      .where("idStudent", "==", studentId)
      .where("idProfessional", "==", idProfessional)
      .where("date", "==", date)
      .where("hour.start", "==", hourStart)
      .where("hour.end", "==", hourEnd)
      .where("statusSession", "==", "pending")
      .get();

    if (!existingSessionsWithTheSameProfessional.empty) {
      console.log("Já existe esse horário");
      throw new Error(
        "Já existe uma sessão agendada entre este aluno e profissional nesta data e horário"
      );
    }

    const existingSessionsWithTheSameDateHourProfessional = await firestore
      .collection("scheduling-nuape/schedules/schedule")
      .where("idProfessional", "==", idProfessional)
      .where("date", "==", date)
      .where("hour.start", "==", hourStart)
      .where("hour.end", "==", hourEnd)
      .where("statusSession", "==", "pending")
      .get();

    const existingSessionsWithTheSameDateHourStudent = await firestore
      .collection("scheduling-nuape/schedules/schedule")
      .where("idStudent", "==", studentId)
      .where("date", "==", date)
      .where("hour.start", "==", hourStart)
      .where("hour.end", "==", hourEnd)
      .where("statusSession", "==", "pending")
      .get();

    if (
      !existingSessionsWithTheSameDateHourProfessional.empty ||
      !existingSessionsWithTheSameDateHourStudent
    ) {
      console.log("Já existe esse horário");
      throw new Error("Já existeuma sessão agendada nesta data e horário");
    }

    const reasonEcrypted = encryptText(reason, "pugftrn uapet-p");
    const firstNameStudent = studentData.fullname.split(" ")[0];
    const firstNameProfessional = professionalQuery
      .data()
      .fullname.split(" ")[0];
    const sessionTitle = `Reunião de ${firstNameStudent} com ${firstNameProfessional}`;
    const newSession = {
      sessionTitle: sessionTitle,
      coursePeriod: coursePeriod,
      idStudent: studentId,
      idProfessional: idProfessional,
      date: date,
      hour: { start: hourStart, end: hourEnd },
      modality: modality,
      reason: reasonEcrypted,
      statusSession: statusSession,
      academicRecordStudent: academicRecordStudent,
      courseStudent: studentData.area,
      emailStudent: studentData.email,
      emailProfessional: professionalQuery.data().email,
      creationDate: new Date().toISOString(),
    };

    const newScheduleRef = await firestore
      .collection("/scheduling-nuape/schedules/schedule")
      .add(newSession);

    const dateFormated = new Date(newSession.date).toLocaleDateString("pt-BR");
    let descriptionEmailHtml;
    let descriptionEmailText;

    if (modality === "REMOTO") {
      descriptionEmailHtml = `<h4> Olá, tudo bem?</h4><p>Este e-mail é um lembrete para a sessão que você agendou com o profissional <strong>${
        professionalQuery.data().fullname
      }</strong> no dia ${dateFormated} às ${
        newSession.hour.start
      }</p><p>O link para a reunião é este: ${
        professionalQuery.data().linkMeet
      }</p><p>Para qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }</p><p>Tenha uma ótima sessão!</p>`;

      descriptionEmailText = `Olá, tudo bem?\nEste e-mail é um lembrete para a sessão que você agendou com o profissional ${
        professionalQuery.data().fullname
      } no dia ${dateFormated} às ${
        newSession.hour.start
      }\nPara qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }\nTenha uma ótima sessão!`;
    } else {
      descriptionEmailHtml = `<h4> Olá, tudo bem?</h4><p>Este e-mail é um lembrete para a sessão que você agendou com o profissional <strong>${
        professionalQuery.data().fullname
      }</strong> no dia ${dateFormated} às ${
        newSession.hour.start
      }</p></br><p>Para qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }</p><p>Tenha uma ótima sessão!</p>`;

      descriptionEmailText = `Olá, tudo bem?\nEste e-mail é um lembrete para a sessão que você agendou com o profissional ${
        professionalQuery.data().fullname
      } no dia ${dateFormated} às ${
        newSession.hour.start
      }\nPara qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${
        newSession.emailProfessional
      }\nTenha uma ótima sessão!`;
    }

    // transport.sendMail({
    //   from: "Agendamento de sessão - NUAPE-PG <tester.nuape@outlook.com>",
    //   to: `${newSession.emailStudent}, ${newSession.emailProfessional}`,
    //   subject: `${sessionTitle} - ${dateFormated} às ${newSession.hour.start}`,
    //   html: descriptionEmailHtml,
    //   text: descriptionEmailText,
    // });

    transport.sendMail(
      {
        from: "Agendamento de sessão - NUAPE-PG <tester.nuape@outlook.com>",
        to: `${newSession.emailStudent}, ${newSession.emailProfessional}`,
        subject: `${sessionTitle} - ${dateFormated} às ${newSession.hour.start}`,
        html: descriptionEmailHtml,
        text: descriptionEmailText,
      },
      (error) => {
        if (error) {
          console.error("Erro ao enviar e-mail:", error);
        }
      }
    );

    console.log("Nova sessão inserida com sucesso manualmente!");
    console.log("ID da nova sessão:", newScheduleRef.id);
    res.status(201).json({ message: "Sessão cadastrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar sessão:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

//cancelamento de sessão
router.put("/:sessionId/cancel", async (req, res) => {
  console.log("----- CANCELAMENTO DE SESSÃO -------");
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
        console.log(userId);
      } else {
        console.log("Campo typeAccount não encontrado no token.");
        return res.status(401).json({
          error:
            "Erro na estrutura do token. Campo typeAccount não encontrado no token",
        });
      }
    }
  });

  try {
    const firestore = admin.firestore();
    if (typeAccount === "student") {
      const studentQuery = await firestore
        .collection("scheduling-nuape/users/students")
        .doc(userId)
        .get();

      if (studentQuery.empty) {
        console.log("Usuário não encontrado");
        throw new Error("Usuário não encontrado em nosso banco de dados!");
      }
    } else if (typeAccount === "professional") {
      const professionalQuery = await firestore
        .collection("scheduling-nuape/users/professionals")
        .doc(userId)
        .get();

      if (professionalQuery.empty) {
        console.log("Usuário não encontrado");
        throw new Error("Usuário não encontrado em nosso banco de dados!");
      }
    } else {
      throw new Error("Tipo de conta inválido");
    }

    const { sessionId } = req.params;
    const cancelReason = req.body.cancelReason;

    const sessionRef = admin
      .firestore()
      .collection("scheduling-nuape/schedules/schedule")
      .doc(sessionId);

    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new Error("Sessão não encontrada");
    }

    await sessionRef.update({
      statusSession: "canceled",
      cancelReason: cancelReason, // Novo campo para armazenar o motivo do cancelamento
    });

    const { sessionTitle, date, emailProfessional, emailStudent, hour } =
      sessionDoc.data();

    const dateFormated = new Date(date).toLocaleDateString("pt-BR");

    const descriptionEmailHtml = `<h4> Olá, tudo bem?</h4><p>Este e-mail é um lembrete para avisar que a <strong>${sessionTitle}</strong> agendada para o dia ${dateFormated} às ${hour.start} foi cancelada por motivos de: <strong>${cancelReason}</strong></p></br><p>Para qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${emailProfessional}</p>`;

    const descriptionEmailText = `Olá, tudo bem? Este e-mail é um lembrete para avisar que a ${sessionTitle} agendada para o dia ${dateFormated} às ${hour.start} foi cancelada por motivos de: ${cancelReason}.\nPara qualquer dúvida entre encontado com o NUAPE através do e-mail: nuape-pg@utfpr.edu.br ou pelo e-mail do profissional: ${emailProfessional}`;

    // transport.sendMail({
    //   from: "Cancelamento de sessão - NUAPE-PG <tester.nuape@outlook.com>",
    //   to: `${emailStudent}, ${emailProfessional}`,
    //   subject: `${sessionTitle} - ${dateFormated} às ${hour.start}`,
    //   html: descriptionEmailHtml,
    //   text: descriptionEmailText,
    // });

    transport.sendMail(
      {
        from: "Cancelamento de sessão - NUAPE-PG <tester.nuape@outlook.com>",
        to: `${emailStudent}, ${emailProfessional}`,
        subject: `${sessionTitle} - ${dateFormated} às ${hour.start}`,
        html: descriptionEmailHtml,
        text: descriptionEmailText,
      },
      (error) => {
        if (error) {
          console.error("Erro ao enviar e-mail:", error);
        }
      }
    );

    console.log(`Sessão ${sessionId} cancelada com sucesso!`);
    res.status(200).json({ message: "Sessão cancelada com sucesso" });
  } catch (error) {
    console.error("Erro ao cancelar sessão:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

//conclusão da sessão
router.put("/:sessionId/complete", async (req, res) => {
  console.log("----- FINALIZAÇÃO DA SESSÃO -------");
  const token = req.headers.authorization;
  if (!token) {
    console.log("token não fornecido");
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
        console.log(userId);
      } else {
        console.log("Campo typeAccount não encontrado no token.");
        return res
          .status(401)
          .json({ error: "Campo typeAccount não encontrado no token." });
      }
    }
  });

  try {
    const firestore = admin.firestore();
    if (typeAccount === "student") {
      const studentQuery = await firestore
        .collection("scheduling-nuape/users/students")
        .doc(userId)
        .get();

      if (studentQuery.empty) {
        console.log("Usuário não encontrado");
        throw new Error("Usuário não encontrado em nosso banco de dados!");
      }
    } else if (typeAccount === "professional") {
      const professionalQuery = await firestore
        .collection("scheduling-nuape/users/professionals")
        .doc(userId)
        .get();

      if (professionalQuery.empty) {
        console.log("Usuário não encontrado");
        throw new Error("Usuário não encontrado em nosso banco de dados!");
      }
    } else {
      throw new Error("Tipo de conta inválido!");
    }

    const { sessionId } = req.params;

    const sessionRef = admin
      .firestore()
      .collection("scheduling-nuape/schedules/schedule")
      .doc(sessionId);

    const sessionDoc = await sessionRef.get();

    if (!sessionDoc.exists) {
      throw new Error("Sessão não encontrada");
    }

    await sessionRef.update({
      statusSession: "completed",
    });
    console.log(`Sessão ${sessionId} finalizada com sucesso!`);
    res.status(200).json({ message: "Sessão finalizada com sucesso" });
  } catch (error) {
    console.error("Erro ao finalizar sessão:", error.message);
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
