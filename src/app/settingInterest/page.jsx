"use client";

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function SettingInterest() {
  const router = useRouter();
  const [interestArray, setInterestArray] = useState([]);
  const [dataInterest, setDataInterest] = useState([]);
  const [input, setInput] = useState([]);
  const [userId, setUserId] = useState("");
  const [bearer, setBearer] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      setBearer(savedToken);
      const decoded = jwtDecode(savedToken);
      const user_id = decoded.id;
      setUserId(user_id);
      const expirationTime = new Date(decoded.exp * 1000);
      const currentTime = new Date();

      if (currentTime > expirationTime) {
        localStorage.removeItem("accessToken");
        router.push(`/`);
      } else {
        const response = async () => {
          try {
            const resData = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interest/getInterestByUserId/${user_id}`
            );
            setDataInterest(resData.data);
          } catch (error) {
            console.log(error);
          }
        };
        response();
      }
    } else {
      router.push(`/`);
    }
  }, []);

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (input.trim() !== "" && !interestArray.includes(input)) {
      setInterestArray([...interestArray, input]);
      setInput("");
    }
  };

  const handleRemoveInterestArray = (index) => {
    // setInterest(interest.filter((item) => item !== interest));
    setInterestArray((prevNames) => prevNames.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (interestArray.length > 0) {
      const formData = interestArray.map((d) => ({
        user_id: userId, // Menggunakan transaksi_id yang baru di-set
        my_interest: d,
      }));

      try {
        // Mengirim formData ke API pemesanan
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interest/createInterest`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${bearer}`,
            },
          }
        );

        router.push(`/`);
      } catch (error) {
        console.log(error);
      }
    } else {
      router.push(`/`);
    }
  };
  const handleRemoveDataInterest = (id) => {
    const savedToken = localStorage.getItem("accessToken");
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interest/deleteInterest/${id}`,
        {
          headers: {
            Authorization: "Bearer " + savedToken,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          const response = async () => {
            try {
              const resData = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interest/getInterestByUserId/${userId}`
              );
              setDataInterest(resData.data);
            } catch (error) {
              console.log(error);
            }
          };
          response();
        } else {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="pt-[100px] py-2 bg-gradient-to-r h-screen from-regal-black from-10% via-regal-dark via-50% to-regal-gray to-100%">
        <div className="grid gap-2 mx-auto w-96">
          <div className="flex gap-2 justify-between p-2">
            <div className="flex px-2 gap-2">
              <img src="/images/left.png" className="w-2 h-4 my-auto" />
              <p
                onClick={() => router.push("/")}
                className="flex gap-2 cursor-pointer text-lg text-white my-auto"
              >
                Back
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="font-semibold text-gold-600 text-lg my-auto ml-[60px] text-center"
            >
              Save
            </button>
          </div>
          <div className="mt-20 p-2">
            <p className="text-lg font-bold bg-multi-color-text bg-clip-text text-transparent">
              Tell everyone about yourself
            </p>
            <h1 className="text-xl text-white font-bold">What interest you?</h1>
          </div>
          <div className="w-[324px] relative h-auto mx-auto rounded bg-bck p-2">
            <form onSubmit={handleAddInterest} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add your interest"
                className="w-full px-2 py-1 rounded bg-gray-800 text-white"
              />
              <button
                type="submit"
                className="px-4 py-1 rounded bg-multi-color-blue text-white"
              >
                Add
              </button>
            </form>
            <div className="mt-4 flex flex-wrap gap-2">
              {dataInterest &&
                dataInterest.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-3 py-1 rounded bg-gray-700 text-white"
                  >
                    {item.my_interest}
                    <button
                      onClick={() => handleRemoveDataInterest(item.id)}
                      className="text-red-500 font-bold"
                    >
                      x
                    </button>
                  </div>
                ))}
              {interestArray.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded bg-gray-700 text-white"
                >
                  {interest}
                  <button
                    onClick={() => handleRemoveInterestArray(index)}
                    className="text-red-500 font-bold"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
