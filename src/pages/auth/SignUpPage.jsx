import { useState } from "react";
import { Toaster } from "react-hot-toast";
import CustomAuthForm from "../../components/auth/CustomAuthForm";
import CustomAuthHeaderText from "../../components/auth/CustomAuthHeaderText";
import CustomAuthInput from "../../components/auth/CustomAuthInput";
import CustomAuthButton from "../../components/auth/CustomAuthButton";
import CustomAuthText from "../../components/auth/CustomAuthText";
import { AUTH_ENDPOINTS, BASE_URL } from "../../api/endPoints";
import useRegister from "../../hooks/useRegister";
import { Loader } from "lucide-react";
import { validatePassword } from "../../validation/validations";

const validator = (username, password, confirmPassword) => {
  const errors = {};
  if (!username) errors.username = "Username is required";
  else if (username.length < 2)
    errors.username = "Username must be at least 2 characters";

  if (!password) errors.password = "Password is required";
  else if (!validatePassword(password))
    errors.password = "Password must be at least 6 characters";
  if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
  else if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";
  return errors;
};

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validator(username, password, confirmPassword);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await register(
      `${BASE_URL}${AUTH_ENDPOINTS.REGISTER}`,
      { username, password },
      "/login"
    );
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
          type="text"
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
        <CustomAuthInput
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <br />

        <CustomAuthButton
          type="submit"
          text={isLoading ? "Loading..." : "Sign Up"}
        />

        <CustomAuthText
          href="/login"
          text="Already have an account?"
          linkText="Login here"
        />
      </CustomAuthForm>
    </div>
  );
}
