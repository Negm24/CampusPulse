import React, { useState } from "react";
import { useForm } from "react-hook-form";

const StepCredentials = ({ updateForm, handleRegisterFlag }) => {
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    // Confirm password first:
    const passwordsMatch = data.password === data.password_confirm;
    console.log("Is password equal:", passwordsMatch);
    
   if (passwordsMatch) {
      console.log("I am inside if passwords match:", passwordsMatch);
      // Update form data with credentials
      updateForm({
        username: data.username,
        password: data.password
      });
    }
    handleRegisterFlag();
  };

  return (
    <div>
      <h2>Account Information</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username:</label>
        <input
          type="text"
          {...register("username", { required: "Username is required" })}
        />
        <br />

        <label>Password:</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
        />
        <br />

        <label>Confirm Password:</label>
        <input
          type="password"
          {...register("password_confirm", { required: "Please confirm your password" })}
        />
        <br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StepCredentials;
