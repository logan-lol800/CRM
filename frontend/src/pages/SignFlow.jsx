import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosFrontend";

const SignFlow = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    address: "",
    username: "",
    password: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/.test(password);

  const isBirthComplete = form.birthYear && form.birthMonth && form.birthDay;

  const isFormValid =
    form.email &&
    form.password &&
    form.username &&
    isValidEmail(form.email) &&
    isValidPassword(form.password) &&
    isBirthComplete;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 個別欄位即時驗證
    if (name === "email") {
      if (!value) setEmailError("⚠️ 請輸入你的電子郵件");
      else if (!isValidEmail(value)) setEmailError("⚠️ 電子郵件格式不正確");
      else setEmailError("");
    }

    if (name === "password") {
      if (!value) setPasswordError("⚠️ 請輸入你的密碼");
      else if (!isValidPassword(value))
        setPasswordError(
          "⚠️ 密碼需至少12字，含大小寫、數字與特殊符號"
        );
      else setPasswordError("");
    }

    if (name === "username") {
      if (!value) setUsernameError("⚠️ 請輸入你的用戶名");
      else setUsernameError("");
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const birthDate = `${form.birthYear}-${String(form.birthMonth).padStart(
      2,
      "0"
    )}-${String(form.birthDay).padStart(2, "0")}`;

    const payload = {
      email: form.email,
      account: form.email,
      customerName: form.username,
      password: form.password,
      address: form.address,
      birthday: birthDate,
    };

    try {
      const response = await axios.post("/customer/register", payload);
      console.log("註冊成功:", response.data);
      navigate("/SignSuccess");
    } catch (error) {
      console.error("註冊失敗:", error.response?.data || error.message);
      alert("註冊失敗，請確認輸入資料是否正確");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-2">立即註冊會員</h2>
      <p className="text-sm text-gray-600 mb-4">請填寫以下資訊以建立帳號</p>

      {/* 電子郵件 */}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1 text-sm text-gray-700">
          電子郵件
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            emailError ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {emailError && (
          <p className="text-red-500 text-sm mt-1 ml-1">{emailError}</p>
        )}
      </div>

      {/* 密碼 */}
      <div className="mb-4 relative">
        <label htmlFor="password" className="block mb-1 text-sm text-gray-700">
          密碼
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          value={form.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            passwordError ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-[38px] text-gray-500"
        >
          {showPassword ? <LuEye /> : <LuEyeClosed />}
        </button>
        {passwordError && (
          <p className="text-red-500 text-sm mt-1 ml-1">{passwordError}</p>
        )}
      </div>

      {/* 用戶名 */}
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1 text-sm text-gray-700">
          用戶名
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={form.username}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            usernameError ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
        />
        {usernameError && (
          <p className="text-red-500 text-sm mt-1 ml-1">{usernameError}</p>
        )}
      </div>

      {/* 地址（選填） */}
      <div className="mb-4">
        <label htmlFor="address" className="block mb-1 text-sm text-gray-700">
          地址（選填）
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={form.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 出生日 */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          出生日期
        </label>
        <div className="flex justify-between gap-2">
          <select
            name="birthYear"
            value={form.birthYear}
            onChange={handleChange}
            className="w-1/3 border rounded-md py-2 px-2 focus:outline-none border-gray-300"
          >
            <option value="">年</option>
            {Array.from({ length: 100 }, (_, i) => 2025 - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            name="birthMonth"
            value={form.birthMonth}
            onChange={handleChange}
            className="w-1/3 border rounded-md py-2 px-2 focus:outline-none border-gray-300"
          >
            <option value="">月</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            name="birthDay"
            value={form.birthDay}
            onChange={handleChange}
            className="w-1/3 border rounded-md py-2 px-2 focus:outline-none border-gray-300"
          >
            <option value="">日</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        {!isBirthComplete && (
          <p className="text-red-500 text-sm mt-1 ml-1">
            ⚠️ 請選擇完整出生日期
          </p>
        )}
      </div>

      {/* 送出按鈕 */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid}
        className={`w-full font-bold py-3 rounded-md transition ${
          isFormValid
            ? "bg-sky-500 text-white hover:bg-sky-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        立即加入
      </button>
    </div>
  );
};

export default SignFlow;
