import style from "./style.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../input/Input";
import Select from "../../select/Select";
import api from "../../../api";
import { toast } from "react-toastify";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAcademicRecord,
  validatePassword,
  validateCourse,
} from "../../../utils/formvalidations";

const FormRegister = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    academicRecord: "",
    course: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    academicRecord: "",
    course: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleBlur = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "fullname":
        setErrors({ ...errors, fullname: validateName(value) });
        break;

      case "email":
        setErrors({ ...errors, email: validateEmail(value) });
        break;

      case "phone":
        setErrors({ ...errors, phone: validatePhone(value) });
        break;

      case "academicRecord":
        setErrors({ ...errors, academicRecord: validateAcademicRecord(value) });
        break;

      case "course":
        setErrors({ ...errors, course: validateCourse(value) });
        break;

      case "password":
        setErrors({ ...errors, password: validatePassword(value) });
        break;

      default:
        break;
    }
  };

  const formFields = [
    { label: "Nome completo", name: "fullname", type: "text", required: true },
    { label: "E-mail", name: "email", type: "email", required: true },
    { label: "Celular", name: "phone", type: "text", required: true },
    {
      label: "Registro Acadêmico",
      name: "academicRecord",
      type: "text",
      required: true,
    },
    {
      label: "Curso",
      name: "course",
      type: "select",
      options: [
        { value: "", label: "" },
        {
          value: "ANÁLISE E DESENVOLVIMENTO DE SISTEMAS",
          label: "Análise e Desenvolvimento de Sistemas",
        },
        { value: "AUTOMAÇÃO INDUSTRIAL", label: "Automação Industrial" },
        { value: "CIÊNCIAS BIOLÓGICAS", label: "Ciências Biológicas" },
        { value: "CIÊNCIA DA COMPUTAÇÃO", label: "Ciência da Computação" },
        {
          value: "ENGENHARIA DE BIOPROCESSOS E BIOTECNOLOGIA",
          label: "Engenharia de Bioprocessos e Biotecnologia",
        },
        { value: "ENGENHARIA ELÉTRICA", label: "Engenharia Elétrica" },
        { value: "ENGENHARIA MECÂNICA", label: "Engenharia Mecânica" },
        { value: "ENGENHARIA DE PRODUÇÃO", label: "Engenharia de Produção" },
        { value: "ENGENHARIA QUÍMICA", label: "Engenharia Química" },
        { value: "FABRICAÇÃO MECÂNICA", label: "Fabricação Mecânica" },
      ],
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
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      academicRecord: formData.academicRecord.trim(),
      course: formData.course,
      password: formData.password.trim(),
    };

    const registerPromise = api.post("register/student", userData);
    toast
      .promise(registerPromise, {
        pending: "Realizando cadastro...",
        success: "Cadastro realizado com sucesso!",
      })
      .then(() => {
        setLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        setLoading(false);
        // console.error("Erro capturado:", error);
        // console.error("Erro:", error.message);
        console.log("Erro-> ", error.response.data.message);
        toast.error(error.response.data.message);
      });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    formFields.forEach((field) => {
      switch (field.fullname) {
        case "fullname":
          const nameError = validateName(formData.name);
          if (nameError) {
            newErrors[field.name] = nameError;
            isValid = false;
          }
          break;

        case "email":
          const emailError = validateEmail(formData.email);
          if (emailError) {
            newErrors[field.name] = emailError;
            isValid = false;
          }
          break;

        case "phone":
          const phoneError = validatePhone(formData.phone);
          if (phoneError) {
            newErrors[field.name] = phoneError;
            isValid = false;
          }
          break;

        case "academicRecord":
          const academicRecordError = validateAcademicRecord(
            formData.academicRecord
          );
          if (academicRecordError) {
            newErrors[field.name] = academicRecordError;
            isValid = false;
          }
          break;

        case "course":
          const courseError = validateCourse(formData.course);
          if (courseError) {
            newErrors[field.name] = courseError;
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
      {formFields.map((field, index) => (
        <div key={index}>
          {field.type === "select" ? (
            <Select
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              options={field.options}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors[field.name]}
              required={field.required}
            />
          ) : (
            <Input
              label={field.label}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              onBlur={handleBlur}
              error={errors[field.name]}
              required={field.required}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className={`${loading ? "btn-disable" : "btn-filed-yellow"} ${
          style.btnForm
        }`}
      >
        Cadastrar
      </button>
    </form>
  );
};

export default FormRegister;
