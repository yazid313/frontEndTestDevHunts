"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [data, setData] = useState({});
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmpassword: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (token) {
      router.push("/profile");
    }
  }, [router.push]);

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmpassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const register = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/createProfile`,
        data
      );
      if (register) {
        alert("Registration successful");
        router.push("/login");
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  console.log(data);
  return (
    <>
      <div className="h-screen pt-[100px] bg-gradient-to-r from-regal-black via-regal-dark to-regal-gray">
        <div className="mx-auto w-96">
          <h1 className="text-white text-2xl ml-[18px] mb-[25px]">Register</h1>
          <form
            onSubmit={handleRegister}
            className="text-white grid gap-[15px] w-96 mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              className="h-[51px] rounded-lg p-2 bg-regal-gray"
              required
            />

            {/* Input Username */}
            <input
              type="text"
              name="username"
              placeholder="Create Username"
              onChange={handleChange}
              className="h-[51px] rounded-lg p-2 bg-regal-gray"
              required
            />

            <div className="flex justify-between items-center h-[51px] rounded-lg p-2 bg-regal-gray">
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                placeholder="Create Password"
                onChange={handleChange}
                className="bg-regal-gray w-full"
                required
              />
              <img
                onClick={() => togglePassword("password")}
                src="/images/eyes.png"
                alt="Toggle password visibility"
                className="w-5 h-[17px] cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center h-[51px] rounded-lg p-2 bg-regal-gray">
              <input
                type={showPassword.confirmpassword ? "text" : "password"}
                name="confirmpassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                className="bg-regal-gray w-full"
                required
              />
              <img
                onClick={() => togglePassword("confirmpassword")}
                src="/images/eyes.png"
                alt="Toggle confirm password visibility"
                className="w-5 h-[17px] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg mt-[10px] h-12 text-lg text-white bg-gradient-to-r from-regal-blue to-regal-sky"
            >
              Register
            </button>

            <p className="text  -white text-center">
              Have an account?{" "}
              <a href="/login" className="text-yellow-400 hover:underline">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
