import { useState } from "react";
import CustomAuthInput from "../../components/auth/CustomAuthInput";
import CustomAuthButton from "../../components/auth/CustomAuthButton";
import CustomAuthForm from "../../components/auth/CustomAuthForm";
import CustomAuthText from "../../components/auth/CustomAuthText";
import CustomAuthHeaderText from "../../components/auth/CustomAuthHeaderText";
import {
  validatePassword,
  validateUsername,
} from "../../validation/validations";
import useLogin from "../../hooks/useLogin";
import { AUTH_ENDPOINTS, BASE_URL } from "../../api/endPoints";
import { Toaster } from "react-hot-toast";
import { Loader } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { login, isLoading } = useLogin();
  const validator = (username, password) => {
    const errors = {};
    if (!username) errors.username = "Username is required";
    else if (!validateUsername(username))
      errors.username = "Invalid Username format";
    if (!password) errors.password = "Password is required";
    else if (!validatePassword(password))
      errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validator(username, password);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const data = {
      username: username,
      password: password,
    };
    await login(`${BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, data, "/dashboard");
  };

  return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <Toaster position="bottom-center" reverseOrder={false} />
        <CustomAuthForm onSubmit={handleSubmit}>
          <CustomAuthHeaderText
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
          />
          <CustomAuthInput
            type="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />
          <CustomAuthInput
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <br />
          
          <CustomAuthButton type="submit" text={isLoading ? "Loading..." : "Login" } />

          <CustomAuthText
            href="/sign-up"
            text="Don't have an account?"
            linkText="Create one"
          />
        </CustomAuthForm>
      </div>
  );
}
