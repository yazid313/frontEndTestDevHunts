"use client";

import About from "./about";
import Interest from "./interest";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function Profile() {
  const [dataUser, setDataUser] = useState([]);
  const [dataProfile, setDataProfile] = useState([]);
  const [bearer, setBearer] = useState("");
  const [userId, setuserId] = useState("");
  const router = useRouter();

  // cek token
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    setBearer(savedToken);

    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      const user_id = decoded.id;
      setuserId(user_id);
      const expirationTime = new Date(decoded.exp * 1000);
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        localStorage.removeItem("accessToken");
        router.push(`/`);
      } else {
        const response = async () => {
          try {
            const resData = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/about/getAboutAndUser/${user_id}`
            );
            setDataUser(resData.data);
            setDataProfile(resData.data.abouts);
          } catch (error) {
            console.log(error);
          }
        };
        response();
      }
    } else {
      router.push(`/login`);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <div className="min-h-screen pt-[100px] py-2 bg-gradient-to-r from-regal-black from-10% via-regal-dark via-50% to-regal-gray to-100%">
        <div className="grid gap-2 mx-auto w-96 ">
          <div className="flex gap-2 ">
            <div className="flex px-2 gap-2">
              <img src="/images/left.png" className="w-2 h-4 my-auto" />
              <button
                onClick={handleLogout}
                className="flex gap-2 text-lg text-white my-auto"
              >
                {" "}
                Back
              </button>
            </div>
            <h1 className="font-semibold text-white text-lg my-auto ml-[60px] text-center ">
              @{dataUser.username}
            </h1>
          </div>
          <div className="w-[359px] relative h-[190px] mx-auto rounded bg-bck">
            <div
              className={`${
                dataProfile.length > 0 ? "block" : "hidden"
              } bg-white h-[140px]`}
            >
              <img
                src={`${
                  dataProfile.length > 0
                    ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${dataProfile[0].photo}`
                    : "-"
                }`}
                className="w-full h-full my-auto"
              />
            </div>
            <p className="absolute text-white bottom-0 pl-[13px] pb-[17px] text-lg">
              @
              {dataProfile.length > 0
                ? dataProfile[0].display_name
                : dataUser.username}
            </p>
          </div>
          <div>
            <About dataProfile={dataProfile} />
          </div>
          <div>
            <Interest />
          </div>
        </div>
      </div>
    </>
  );
}
