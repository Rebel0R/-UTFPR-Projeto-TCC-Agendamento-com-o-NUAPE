//Essa arquivo é responsável por conter a validação dos campos de um formulário, onde ele retorna uma string vazia ou não.
// -- Uma string vazia indica que a validação não encontrou nenhum erro, do contrário a mensagem de erro é encontrada e tratada no span

export const validateName = (name) => {
  const caracter = /[^a-zA-Z\s]/;
  const trimmedName = name.trim();

  const validations = [
    {
      condition: trimmedName === "",
      message: "Este campo é obrigatório. Por favor, digite seu nome completo.",
    },
    {
      condition: !(trimmedName.split(" ").length >= 2),
      message:
        "É necessário inserir o nome completo. Por favor, digite novamente.",
    },
    {
      condition: caracter.test(trimmedName),
      message:
        "O nome inserido contém caracteres especiais que não são permitidos. Por favor, utilize apenas letras.",
    },
    {
      condition: trimmedName.length < 10,
      message: "É necessário que o nome possua pelo menos 10 caracteres.",
    },
    {
      condition: trimmedName.length > 60,
      message: "É necessário que o nome possua no máximo 60 caracteres.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateEmail = (email) => {
  const trimmedEmail = email.trim();

  const validations = [
    {
      condition: trimmedEmail === "",
      message: "Este campo é obrigatório. Por favor, digite seu e-mail.",
    },
    {
      condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail),
      message:
        "O endereço de email inserido não é válido. Por favor, insira um endereço de email válido.",
    },
    {
      condition:
        trimmedEmail.split("@")[0].length < 4 ||
        trimmedEmail.split("@")[1].length < 5,
      message:
        "O endereço de e-mail não está válido. Por favor, insira um endereço válido de e-mail.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validatePhone = (phone) => {
  const trimmedPhone = phone.trim();
  const validations = [
    {
      condition: trimmedPhone === "",
      message:
        "Este campo é obrigatório. Por favor, digite seu número de celular.",
    },
    {
      condition: !/^\d{11}$/.test(trimmedPhone),
      message:
        "Por favor, insira um número de celular válido. O número deve ter entre 10 e 11 dígitos.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateAcademicRecord = (academicRecord) => {
  const trimmedAcademicRecord = academicRecord.trim();
  const validations = [
    {
      condition: trimmedAcademicRecord === "",
      message:
        "Este campo é obrigatório. Por favor, digite seu registro acadêmico",
    },
    {
      condition: !/^a\d{7}$/.test(trimmedAcademicRecord),
      message:
        "Por favor, insira um registro acadêmico válido. Deve começar com 'a' seguido por 7 números.",
    },
    {
      condition: trimmedAcademicRecord.length !== 8,
      message:
        "Por favor, insira um registro acadêmico válido. O registro acadêmico deve ter exatamente 8 caracteres.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateCourse = (course) => {
  const trimmedCourse = course.trim();
  const validations = [
    {
      condition: trimmedCourse === "",
      message: "Por favor, selecione um curso.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validatePassword = (password) => {
  const trimmedPassword = password.trim();
  const validations = [
    {
      condition: trimmedPassword === "",
      message: "Este campo é obrigatório. Por favor, digite sua senha.",
    },
    {
      condition: !/^(?=.*\d).{8}$/.test(trimmedPassword),
      message:
        "Por favor, insira uma senha válida. Deve ter pelo menos 8 caracteres e conter pelo menos letras e números.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateCoursePeriod = (coursePeriod) => {
  const trimmedCoursePeriod = coursePeriod.trim();
  if (trimmedCoursePeriod === "") {
    return "";
  }
  const validPeriods = [
    "1º Período",
    "2º Período",
    "3º Período",
    "4º Período",
    "5º Período",
    "6º Período",
    "7º Período",
    "8º Período",
    "9º Período",
    "10º Período",
  ];

  if (!validPeriods.includes(trimmedCoursePeriod)) {
    return "Por favor, selecione um período válido.";
  }

  return "";
};

export const validateReason = (reason) => {
  const trimmedReason = reason.trim();
  const maxLength = 120;
  const validations = [
    {
      condition: trimmedReason === "",
      message:
        "Este campo é obrigatório. Por favor, insira o motivo da sessão.",
    },
    {
      condition: trimmedReason.length > maxLength,
      message: `O motivo da sessão deve ter no máximo ${maxLength} caracteres.`,
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateDate = (date) => {
  const trimmedDate = date.trim();

  const currentDate = new Date();
  const inputDate = new Date(trimmedDate);

  const validations = [
    {
      condition: trimmedDate === "",
      message: "Este campo é obrigatório. Por favor, digite a data.",
    },
    {
      condition: !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate),
      message: "Por favor, insira uma data válida no formato aaaa-mm-dd.",
    },
    {
      condition: inputDate < currentDate,
      message: "A data fornecida não pode ser anterior à data de hoje.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateHour = (hour) => {
  const trimmedHour = hour.trim();

  const validations = [
    {
      condition: trimmedHour === "",
      message: "Este campo é obrigatório. Por favor, digite a hora.",
    },
    {
      condition: !/^\d{2}:\d{2}$/.test(trimmedHour),
      message: "Por favor, insira uma hora válida no formato hh:mm.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};

export const validateModality = (modality) => {
  const trimmedModality = modality.trim();
  const allowedModalities = ["PRESENCIAL", "REMOTO"];

  const validations = [
    {
      condition: trimmedModality === "",
      message: "Este campo é obrigatório. Por favor, selecione uma modalidade.",
    },
    {
      condition: !allowedModalities.includes(trimmedModality),
      message:
        "Por favor, selecione uma modalidade válida: PRESENCIAL ou REMOTO.",
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? error.message : "";
};
