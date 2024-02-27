import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { auth } from "./firebase.config.js";
import OtpInput from "otp-input-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Button, InputField, Title } from "../../../../components";
import axios from "axios";
import useFormData from "../../../../customHooks/useFormData";
import { Select } from "antd";
import { landmarks } from "./landMarks.js";
import { useALert } from "../../../../ContextAPI/AlertContext.jsx";
import "react-phone-input-2/lib/style.css";
import "./createRestForm.css";

function createRestForm({ setShowAddRestaurantModal, fetchData }) {
  const { formData, handleChange } = useFormData({
    restaurantName: "",
    startTime: "",
    closeTime: "",
    streetName: "",
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [landmarksList, setLandmarksList] = useState([]);
  const { showAlert } = useALert();

  // send OTP to phone number
  function onVerification(event) {
    event.preventDefault();
    setIsLoading(true);

    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    if (verified) handleSubmit();
    else {
      const formatPN = "+" + phoneNumber;
      signInWithPhoneNumber(auth, formatPN, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setShowOTP(true);
        })
        .catch((error) => {
          setIsLoading(false);
          showAlert("fail", `Something Went Wrong`);
          console.log(error.message);
        });
    }
  }

  // verify phone number
  function onOTPVerify() {
    setOtpLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setVerified(true);
        setOtpLoading(false);
        setTimeout(() => {
          setShowOTP(false);
          handleSubmit();
        }, 1500);
      })
      .catch((error) => {
        setOtpLoading(false);
        showAlert("danger", `The Code You Interred Is Incorrect`);
      });
  }

  const handleSubmit = (event) => {
    if (!validateForm()) return;
    try {
      const requestBody = {
        ...formData,
        landmarks: landmarksList,
        phoneNumber: phoneNumber,
      };

      const server_ = "https://restaurantchain-server.onrender.com";
      axios
        .post(`${server_}/addnewrestaurant`, requestBody)
        .then((response) => {
          showAlert("success", `Restaurant was added successfully`);
          setShowAddRestaurantModal(false);
          fetchData();
        })
        .catch((e) => {
          showAlert("fail", `Something Went Wrong`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      showAlert("fail", `Something Went Wrong`);
    }
  };

  // handle landmark selection
  const handleLandmarkSelection = (value, options) => {
    let newList = options.map((option) => option.value);
    setLandmarksList(newList);
  };

  function validateForm() {
    // Time validator
    const validateTime = () => {
      const [startHour, startMinute] = formData.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = formData.closeTime.split(":").map(Number);

      const startTimeInMinutes = startHour * 60 + startMinute;
      const endTimeInMinutes = endHour * 60 + endMinute;

      return endTimeInMinutes >= startTimeInMinutes;
    };

    if (!validateTime()) {
      showAlert(
        "danger",
        `close Time can't be before or equal to the opening Time`
      );
      setIsLoading(false);
      return false;
    }

    return true;
  }

  function handleCancel() {
    setShowOTP(false);
    setIsLoading(false);
  }

  return (
    <>
      <div id="recaptcha-container" />
      <div className="form-header">
        <Title text="Add New Restaurant" />
      </div>

      <form className="create-restaurant-form" onSubmit={onVerification}>
        <div className="fields-container">
          <label htmlFor="restaurantName" className="restaurant-input-labels">
            Restaurant Name
          </label>
          <InputField
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            handler={handleChange}
            isRequired={true}
            max_length="30"
          />
        </div>

        <div className="fields-container">
          <label htmlFor="phone" className="restaurant-input-labels">
            Phone Number
            {verified ? (
              <span style={{ color: "green" }}>
                <i className="ri-verified-badge-line"></i>
              </span>
            ) : (
              <></>
            )}
          </label>
          <PhoneInput
            country={"jo"}
            value={phoneNumber}
            onChange={setPhoneNumber}
            className="phone-number-input"
            inputProps={{
              required: true,
            }}
          />
        </div>

        <div className="fields-container">
          <label htmlFor="startTime" className="restaurant-input-labels">
            Opening Hours
          </label>
          <InputField
            type="time"
            name="startTime"
            value={formData.startTime}
            handler={handleChange}
            isRequired={true}
          />

          <label htmlFor="closeTime" className="restaurant-input-labels">
            to
          </label>
          <InputField
            type="time"
            name="closeTime"
            value={formData.closeTime}
            handler={handleChange}
            isRequired={true}
          />
        </div>

        <div className="fields-container">
          <label htmlFor="streetName" className="restaurant-input-labels">
            Street Name
          </label>
          <InputField
            type="text"
            name="streetName"
            value={formData.streetName}
            handler={handleChange}
            isRequired
            max_length="50"
          />
        </div>
        <div className="fields-container">
          <label htmlFor="landmarks" className="restaurant-input-labels">
            Nearby Landmarks
          </label>
          <Select
            mode="multiple"
            className="select-search-field overflowed-select"
            size="small"
            allowClear
            onChange={handleLandmarkSelection}
          >
            {landmarks.map(({ name, id }) => (
              <Select.Option value={name} key={id}>
                <span>{name}</span>
              </Select.Option>
            ))}
          </Select>
        </div>
        <Button
          type="submit"
          text="Create Restaurant"
          isLoading={isLoading}
          backgroundColor="#171F39"
        />
      </form>

      {showOTP ? (
        <>
          <div className="otp-filling-section">
            <label className="phone-label">
              <p>A six-digit code was sent to your number</p>
              <p>Please enter the OTP</p>
            </label>
            <div className="icon-flip-container">
              <div className="icon-spans" id={`verified_${verified}`}>
                <span className="front-face">
                  <i className="ri-door-lock-fill"></i>
                </span>
                <span className="back-face">
                  <i className="ri-verified-badge-line"></i>
                </span>
              </div>
            </div>
            <OtpInput
              value={otp}
              onChange={setOtp}
              OTPLength={6}
              otpType="number"
              disabled={false}
              autoFocus
              className="otp-container"
            ></OtpInput>
            <Button
              text="Verify Phone Number"
              handler={onOTPVerify}
              isLoading={otpLoading}
            />
          </div>
          <div className="overlay" onClick={handleCancel}></div>
          <span className="modal-close-button" onClick={handleCancel}>
            <i className="ri-close-line" />
          </span>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default createRestForm;
