import React, { useEffect, useState, useRef } from "react";
import "./TotpInput.css";
import MyInput from "../../UI/input/MyInput";
import { TOTP } from "totp-generator";

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
      <button onClick={copyTotpCode}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
          />
        </svg>
      </button>
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
