import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TOTPInput = ({ username, password }) => {
  const { userLogin } = useContext(AuthContext);
  const [totpCode, setTotpCode] = useState("");

  let history = useNavigate();

  const handleTOTPSubmit = async (e) => {
    e.preventDefault();
    const response = await userLogin(null, username, password, totpCode);

    if (response.status === 200) {
      setTotpCode("");
      history("/");
    } else {
      alert("Неправильный TOTP код");
    }
  };

  return (
    <form onSubmit={handleTOTPSubmit}>
      <input
        type="text"
        value={totpCode}
        onChange={(e) => setTotpCode(e.target.value)}
        placeholder="Введите TOTP код"
      />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default TOTPInput;
