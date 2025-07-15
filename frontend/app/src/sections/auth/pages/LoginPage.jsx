import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        identifier: data.identifier,
        password: data.password,
      },
        {
            withCredentials: true,
            // credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
        }
    
    );

      localStorage.setItem("access_token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setLoginError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Username / Email / Phone"
          {...register("identifier", { required: true })}
        />
        {errors.identifier && <p className="error">This field is required</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />
        {errors.password && <p className="error">Password is required</p>}

        <button type="submit">Login</button>
      </form>

      {loginError && <p className="error">{loginError}</p>}
    </div>
  );
}
