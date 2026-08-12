// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { useNotification } from "../notify/context/NotificationContext";
import { Header } from "../components/Header";
import HeaderSkeleton from "../skeletons/HeaderSkeleton";
import BalanceSkeleton from "../skeletons/BalanceSkeleton";
import UsersSkeleton from "../skeletons/UsersSkeleton";
import { Footer } from "../components/Footer";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const addNotification = useNotification();
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!username) {
      errors.username = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(username)) {
      errors.username = "Email address is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!firstName) {
      errors.firstName = "First name is required";
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
    }
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await signup(username, firstName, lastName, password);
      if (response.data.user) {
        addNotification("success", response.data.message);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Signup error ", error);
      addNotification(
        "danger",
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
  };

  if (loading) {
    return (
      <>
        <div>
          <HeaderSkeleton />
          <div className="m-8">
            <BalanceSkeleton />
            <UsersSkeleton />
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-white border-t border-[#0e0f0c1f]  min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-10 md:py-10">
        <div className="flex flex-col justify-center w-full md:w-6/12">
          <div className="rounded-lg bg-white w-full text-center p-2 px-12 h-max">
            <Heading label="Create your Temp Money account" />
            <BottomWarning
              label="Already have an account?"
              buttonText="Log in"
              to="/signin"
            />
            <InputBox
              type={"text"}
              onChange={handleFirstNameChange}
              placeholder={"Suyash"}
              label={"First Name"}
              error={errors.firstName}
            />
            <InputBox
              type={"text"}
              onChange={handleLastNameChange}
              placeholder={"Pandey"}
              label={"Last Name"}
              error={errors.lastName}
            />
            <InputBox
              type={"email"}
              onChange={handleUsernameChange}
              placeholder={"SuyashPandey@gmail.com"}
              label={"Email/Username"}
              error={errors.username}
            />
            <InputBox
              type={"password"}
              onChange={handlePasswordChange}
              placeholder={"1a3b5c"}
              label={"Password"}
              error={errors.password}
            />
            <div className="mt-8">
              <Button
                label={loading ? "Signing up..." : "Sign up"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;
