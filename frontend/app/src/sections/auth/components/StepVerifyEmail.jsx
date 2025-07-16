import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const StepVerifyEmail = ({ next, updateForm, email }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendCode = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/send_code", {
        email: data.email,
      });

      updateForm({ email: data.email }); // Store email in formData
      setCodeSent(true);
      setMessage("Code sent to your email.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/auth/verify_code", {
        email,
        code,
      });

      if (res.data.verified) {
        setVerified(true);
        setMessage("Email verified successfully.");
        // Proceed to the next step after 3 seconds
        setTimeout(() => {
          next();
        }, 2000);
      }

    } catch (err) {
      console.error(err);
      setMessage("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Email Verification</h2>

      {!codeSent && (
        <form onSubmit={handleSubmit(sendCode)}>
          <label>Email:</label>
          <input
            type="email"
            defaultValue={email || ""}
            {...register("email", { required: "Email is required" })}
          />
          <br />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>
      )}

      {codeSent && !verified && (
        <>
          <label>Enter the verification code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6-digit code"
          />
          <br />
          <button onClick={verifyCode} disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </>
      )}

      <p>{message}</p>
    </div>
  );
};

export default StepVerifyEmail;
