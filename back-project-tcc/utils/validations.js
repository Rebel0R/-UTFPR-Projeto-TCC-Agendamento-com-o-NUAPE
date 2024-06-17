function validatePassword(password) {
  const trimmedPassword = password.trim();
  const validations = [
    {
      condition: trimmedPassword === "",
      status: true,
    },
    {
      condition: !/^(?=.*\d).{8}$/.test(trimmedPassword),
      status: true,
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? true : false;
}

function validateAcademicRecord(academicRecord) {
  const trimmedAcademicRecord = academicRecord.trim();
  const validations = [
    {
      condition: trimmedAcademicRecord === "",
      status: true,
    },
    {
      condition: !/^a\d{7}$/.test(trimmedAcademicRecord),
      status: true,
    },
    {
      condition: trimmedAcademicRecord.length !== 8,
      status: true,
    },
  ];

  const error = validations.find((validation) => validation.condition);
  return error ? true : false;
}

function validateDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const parts = dateString.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month - 1, day);

  return !(
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

function validateTime(timeString) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  return !regex.test(timeString);
}

module.exports = {
  validatePassword,
  validateAcademicRecord,
  validateDate,
  validateTime,
};
