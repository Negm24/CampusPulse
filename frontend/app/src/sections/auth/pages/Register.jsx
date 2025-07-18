import StepSelectRole from "../components/StepSelectRole";
import StepVerifyEmail from "../components/StepVerifyEmail";
import StepPersonalInfo from "../components/StepPersonalInfo";
import StepCredentials from "../components/StepCredentials";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

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

  const steps = [
    { id: 1, label: "Select Role" },
    { id: 2, label: "Verify Email" },
    { id: 3, label: "Personal Info" },
    { id: 4, label: "Credentials" }
  ];

  const nextStep = () => setStep(prev => prev + 1);

  const prevStep = () => {
    if (step - 1 === 3) { 
      setFormData(prev => ({ ...prev, username: "", password: "" }));
    }
    if (step - 1 === 2) { 
      setFormData(prev => ({ ...prev, first_name: "", last_name: "", phone: "", gender: "", birthdate: "" })); 
    }
    if (step - 1 === 1) { 
      setFormData(prev => ({ ...prev, email: "" })); 
    }
    setStep(prev => prev - 1);
  };

  const updateForm = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const [registerFlag, setRegisterFlag] = useState(false);
  const navigate = useNavigate();

  const handleRegisterFlag = () => {
    setRegisterFlag(true);
  }

  useEffect(() => {
    if (registerFlag) {
      axios.post("http://localhost:5000/auth/register", formData)
        .then(response => {
          navigate("/login");
        })
        .catch(error => {
          console.error("Registration error:", error);
          alert("Registration failed. Please try again.");
        });
      setRegisterFlag(false);
    }
  }, [registerFlag, formData, navigate]);

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-content">
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-steps">
              <div className="progress-bar" style={{ 
                width: `${((step - 1) / (steps.length - 1)) * 100}%` 
              }}></div>
              {steps.map((stepItem) => (
                <div 
                  key={stepItem.id}
                  className={`step-indicator ${
                    step > stepItem.id ? "completed" : 
                    step === stepItem.id ? "active" : ""
                  }`}
                >
                  {step > stepItem.id ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    stepItem.id
                  )}
                  <span className="step-label">{stepItem.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="step-content">
            {step === 1 && <StepSelectRole next={nextStep} updateForm={updateForm} role={formData.role} />}
            {step === 2 && <StepVerifyEmail next={nextStep} updateForm={updateForm} email={formData.email} />}
            {step === 3 && <StepPersonalInfo next={nextStep} updateForm={updateForm} formData={formData} />}
            {step === 4 && <StepCredentials updateForm={updateForm} handleRegisterFlag={handleRegisterFlag} />}
          </div>

          {/* Navigation Buttons */}
          {step > 1 && (
            <div className="button-group">
              <button className="button button-secondary" onClick={prevStep}>
                Back
              </button>
             
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;