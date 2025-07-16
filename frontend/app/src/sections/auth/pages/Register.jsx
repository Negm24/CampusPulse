import StepSelectRole from "../components/StepSelectRole";
import StepVerifyEmail from "../components/StepVerifyEmail";
import StepPersonalInfo from "../components/StepPersonalInfo";
import StepCredentials from "../components/StepCredentials";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    gender: "",
    birthdate: "",
    username: "",
    password: ""
  });

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = () => {
    console.log("Step:", step);
    console.log("Step - 1:", step - 1);
    if (step-1 === 3) { 
      setFormData(prev => ({ ...prev, username: "", password: "" }));
    }
    if (step-1 === 2) { setFormData(prev => ({ ...prev, first_name: "", last_name: "", phone: "", gender: "", birthdate: "" })); }
    if (step-1 === 1) { setFormData(prev => ({ ...prev, email: "" })); }

    setStep(prev => prev - 1);
  };

  const updateForm = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };


  const [registerFlag, setRegisterFlag] = useState(false);

  const handleRegisterFlag = () => {
    setRegisterFlag(true);
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (registerFlag) {

      console.log("Submitting form data:", formData);

      axios.post("http://localhost:5000/auth/register", formData)
        .then(response => {
          console.log("Registration successful:", response.data);
          navigate("/login");
        })
        .catch(error => {
          console.error("Registration error:", error);
          alert("Registration failed. Please try again.");
        });

        setRegisterFlag(false); // Reset the flag after submission
    }
    else {
      console.log("Register flag is false, not submitting form data.");
    }
  }, [registerFlag, formData]);


  return (
    <div>
      {step === 1 && <StepSelectRole next={nextStep} updateForm={updateForm} role={formData.role} />}
      {step === 2 && <StepVerifyEmail next={nextStep} updateForm={updateForm} email={formData.email} />}
      {step === 3 && <StepPersonalInfo next={nextStep} updateForm={updateForm} formData={formData} />}
      {step === 4 && <StepCredentials updateForm={updateForm} handleRegisterFlag={handleRegisterFlag} />}

      {step > 1 && <button onClick={prevStep}>Back</button>}
      {/* This shows formData live */}
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};


export default RegisterPage;