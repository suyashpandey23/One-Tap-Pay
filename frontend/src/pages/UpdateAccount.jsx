import { useState } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";
import axios from "../components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../notify/context/NotificationContext";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import UpdateAccountSkeleton from "../skeletons/UpdateAccountSkeleton";

const UpdateAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const addNotification = useNotification();

  const validate = () => {
    const errors = {};
    if (firstName && firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters long.";
    }
    if (lastName && lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters long.";
    }
    if (password && password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }
    return errors;
  };

  const handleUpdate = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create update data with only non-empty fields
    const updateData = {};
    if (firstName.trim()) updateData.firstName = firstName.trim();
    if (lastName.trim()) updateData.lastName = lastName.trim();
    if (password.trim()) updateData.password = password.trim();

    if (Object.keys(updateData).length === 0) {
      setErrors({ general: "Please fill at least one field to update." });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put("/user", updateData, {
        withCredentials: true,
      });
      addNotification(
        "success",
        response.data.message || "Account updated successfully"
      );
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating account";
      setErrors({ ...errors, server: errorMessage });
      addNotification("danger", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, firstName: "" }));
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, lastName: "" }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <UpdateAccountSkeleton />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#163300] border-t border-[#fefefe] min-h-[86.3vh] md:min-h-[86.7vh] lg:min-h-[90.1vh] 2xl:min-h-[100vh] flex justify-center items-start pt-20">
        <div className="w-10/12 md:w-6/12">
          <div className="flex flex-col justify-center rounded-[32px] bg-white text-center p-8 h-max">
            <h3 className="text-2xl">Update Account Details</h3>
            <div className="border-t border-[#0e0f0c1f] my-5"></div>
            <div className="">
              <p className="mb-3">
                Update your information below (leave fields empty to keep
                current values)
              </p>

              <div className="space-y-4">
                <InputBox
                  onChange={handleFirstNameChange}
                  value={firstName}
                  placeholder="Enter new first name"
                  label={"First Name"}
                  error={errors.firstName}
                />
                <InputBox
                  onChange={handleLastNameChange}
                  value={lastName}
                  placeholder="Enter new last name"
                  label={"Last Name"}
                  error={errors.lastName}
                />
                <InputBox
                  onChange={handlePasswordChange}
                  value={password}
                  type="password"
                  placeholder="Enter new password"
                  label={"Password"}
                  error={errors.password}
                />

                {errors.general && (
                  <div style={{ color: "red", textAlign: "left" }}>
                    {errors.general}
                  </div>
                )}
                {errors.server && (
                  <div style={{ color: "red", textAlign: "left" }}>
                    {errors.server}
                  </div>
                )}

                <div className="mt-6 flex-col flex gap-3">
                  <Button
                    onClick={handleUpdate}
                    label={loading ? "Updating..." : "Update Account"}
                  />
                  <button
                    onClick={handleGoBack}
                    type="button"
                    className="w-full text-[#163300] font-bold bg-[#ffffff1a] border border-[#9fe870] transition-colors duration-150 ease-in-out text-base rounded-full select-none py-2 px-4"
                  >
                    Cancel, Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateAccount;
