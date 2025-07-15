import React from "react";
import { useForm } from "react-hook-form";

const StepSelectRole = ({ next, updateForm, role }) => {

  const onSubmit = () => { 
    updateForm({ role: document.querySelector("select").value });
    next();
  };

  return (
    <div>
      <h2>Select Your Role</h2>
      <form onSubmit={onSubmit}>
        <label>Role:</label>
        <select defaultValue={role} required>
          <option value="">-- Select Role --</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <br />
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default StepSelectRole;
