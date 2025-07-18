import React, { useState } from "react";
import { useForm } from "react-hook-form";

const StepCredentials = ({ updateForm, handleRegisterFlag }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [passwordMatchError, setPasswordMatchError] = useState("");
  
  const password = watch("password");

  const onSubmit = (data) => {
    if (data.password !== data.password_confirm) {
      setPasswordMatchError("Passwords do not match");
      return;
    }
    
    updateForm({
      username: data.username,
      password: data.password
    });
    handleRegisterFlag();
  };

  return (
    <div>
      <h2 className="step-title">Create Account Credentials</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-input"
            {...register("username", { 
              required: "Username is required",
              minLength: {
                value: 4,
                message: "Minimum 4 characters"
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Only letters, numbers and underscores"
              }
            })}
          />
          {errors.username && <p className="form-error">{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Minimum 8 characters"
              }
            })}
          />
          {errors.password && <p className="form-error">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-input"
            {...register("password_confirm", { 
              required: "Please confirm your password",
              validate: (value) => 
                value === password || "Passwords do not match"
            })}
          />
          {errors.password_confirm && (
            <p className="form-error">{errors.password_confirm.message}</p>
          )}
        </div>

        <button type="submit" className="button button-primary" style={{ width: '100%' }}>
          Complete Registration
        </button>
      </form>
    </div>
  );
};

export default StepCredentials;