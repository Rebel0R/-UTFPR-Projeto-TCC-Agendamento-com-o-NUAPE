import style from "./style.module.css";
import React, { useState } from "react";
import Input from "../../input/Input";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { toast } from "react-toastify";
import {
  validateAcademicRecord,
  validatePassword,
} from "../../../utils/formvalidations";

const FormLogin = () => {
  const [formData, setFormData] = useState({
    academicRecord: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    academicRecord: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBlur = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "academicRecord":
        setErrors({ ...errors, academicRecord: validateAcademicRecord(value) });
        break;

      case "password":
        setErrors({ ...errors, password: validatePassword(value) });
        break;

      default:
        break;
    }
  };

  const formFields = [
    {
      label: "Registro Acadêmico",
      name: "academicRecord",
      type: "text",
      required: true,
    },
    { label: "Senha", name: "password", type: "password", required: true },
  ];

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const isFormValid = validateForm();
    if (!isFormValid) {
      toast.error(
        "Dados inválidos no formulário, por favor preenha os campos corretamente!"
      );
      return;
    }

    const userData = {
      academicRecord: formData.academicRecord.trim(),
      password: formData.password.trim(),
    };

    const loginPromise = api.post("login", userData);
    toast
      .promise(loginPromise, {
        pending: "Realizando login...",
        success: "Login realizado com sucesso!",
      })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("token", token);
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Erro capturado:", error);
        console.error("Erro:", error.message);
        toast.error(error.response.data.error);
      });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    formFields.forEach((field) => {
      switch (field.fullname) {
        case "academicRecord":
          const academicRecordError = validateAcademicRecord(
            formData.academicRecord
          );
          if (academicRecordError) {
            newErrors[field.name] = academicRecordError;
            isValid = false;
          }
          break;

        case "password":
          const passwordError = validatePassword(formData.password);
          if (passwordError) {
            newErrors[field.name] = passwordError;
            isValid = false;
          }
          break;

        default:
          break;
      }
    });
    setErrors(newErrors);

    return isValid;
  };

  return (
    <form onSubmit={handleFormSubmit} className={style.formContainer}>
      {formFields.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type}
          placeholder=""
          name={field.name}
          value={formData[field.name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          error={errors[field.name]}
          required={field.required}
        />
      ))}
      <button
        type="submit"
        disabled={loading}
        className={`${loading ? "btn-disable" : "btn-filed-yellow"} ${
          style.btnForm
        }`}
      >
        Entrar
      </button>
    </form>
  );
};

export default FormLogin;
