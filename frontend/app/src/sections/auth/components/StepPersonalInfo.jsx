import React from "react";
import { useForm } from "react-hook-form";

const StepPersonalInfo = ({ next, updateForm, formData }) => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    // Update form data with personal info
    updateForm(data);
    console.log(data);

    next();
  };

  return (
    <div>
      <h2>Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>First Name:</label>
        <input type="text"
          {...register("first_name", { required: "First name is required" })}
          defaultValue={formData.first_name || ""}
        />
        <br />

        <label>Last Name:</label>
        <input type="text"
          {...register("last_name", { required: "Last name is required" })}
          defaultValue={formData.last_name || ""}
        />
        <br />

        <label>Phone Number:</label>
        <input type="text"
          {...register("phone", { required: "Phone number is required" })}
          defaultValue={formData.phone || ""}
          pattern="[0-9]{10,15}"
          placeholder="01234567890"
        />
        <br />

        <label>Gender:</label>
        <select
        {...register("gender", { required: "Gender is required" })}
        defaultValue={formData.gender || ""}
        >
          <option value="">-- Select --</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <br />

        <label>Birthdate:</label>
        <input type="date"
        {...register("birthdate", { required: "Birthdate is required" })}
        defaultValue={formData.birthdate || ""}
        />
        <br />

        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default StepPersonalInfo;
