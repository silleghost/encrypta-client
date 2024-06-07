import React, { useEffect, useState, useRef } from "react";
import "./TotpInput.css";
import MyInput from "../../UI/input/MyInput";
import { TOTP } from "totp-generator";
import CopyButton from "../../UI/button/CopyButton";

const TotpInput = ({ totpSecret }) => {
  const [totpCode, setTotpCode] = useState("");
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (totpSecret) {
      const { otp, expires } = TOTP.generate(totpSecret);
      const currentTime = Date.now();
      setTotpCode(otp);
      const timeRemaining = expires - currentTime;
      setTimer(timeRemaining);
      startTimer(timeRemaining);
    }
  }, [totpSecret]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const startTimer = (duration) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1000);
    }, 1000);
  };

  useEffect(() => {
    if (timer <= 0) {
      const { otp, expires } = TOTP.generate(totpSecret);
      clearInterval(intervalRef.current);
      const currentTime = Date.now();
      setTotpCode(otp);
      const timeRemaining = expires - currentTime;
      setTimer(timeRemaining);
      startTimer(timeRemaining);
    }
  }, [timer, totpSecret]);

  const copyTotpCode = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(totpCode);
  };

  return (
    <div className="totp-input-container">
      <MyInput type="text" value={totpCode} readOnly />
      <CopyButton value={totpCode} />
      <div className="timer-container">
        <div className="timer-value">{Math.floor(timer / 1000)}</div>
        <svg className="timer-circle" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="13"
            strokeDasharray="81.68"
            strokeDashoffset={81.68 - 81.68 * (timer / 30000)}
          />
        </svg>
      </div>
    </div>
  );
};

export default TotpInput;
