import React from "react";
import { useForm } from "react-hook-form";

const StepVerifyEmail = ({ next, updateForm, email }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    updateForm({ email: data.email });
    next();
  };

  return (
    <div>
      <h2>Enter Your Email</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email:</label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email", { required: "Email is required" })}
          defaultValue={email || ""}
        />
        <br />
        <button type="submit">Send Code</button>
      </form>
    </div>
  );
};

export default StepVerifyEmail;