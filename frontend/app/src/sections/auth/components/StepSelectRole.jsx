import React from "react";
import { useForm } from "react-hook-form";

const StepSelectRole = ({ next, updateForm, role }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    updateForm({ role: data.role });
    next();
  };

  return (
    <div>
      <h2 className="step-title">Select Your Role</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select
            className="form-input form-select"
            defaultValue={role}
            {...register("role", { required: "Role is required" })}
          >
            <option value="">-- Select Role --</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="form-error">{errors.role.message}</p>}
        </div>
        <button type="submit" className="button button-primary" style={{ width: '100%' }}>
          Next
        </button>
      </form>
    </div>
  );
};

export default StepSelectRole;