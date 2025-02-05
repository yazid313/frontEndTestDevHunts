"use client";
import { useEffect, useState } from "react";
import SettingAbout from "./settingAbout";
import axios from "axios";

export default function About({ dataProfile }) {
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);

  const toggleEdit = () => setEdit((prev) => !prev);

  useEffect(() => {
    setData(dataProfile ? dataProfile : []);
  }, [dataProfile]);

  //format age
  const calculateAge = (brithday) => {
    if (!brithday) return "N/A";
    const birthDate = new Date(brithday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  //format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSave = (newData) => {
    setData(newData);
    setEdit(false);
  };

  return (
    <div className="mx-auto w-96">
      <div
        className={`${
          edit ? "hidden" : "block"
        } max-w-[359px] relative mx-auto rounded bg-bck`}
      >
        <div className="flex gap-2 justify-between p-2">
          <h1 className="text-white text-sm font-semibold my-auto ml-[18px] text-center">
            About
          </h1>
          <img
            onClick={toggleEdit}
            src="/images/toolsedit.png"
            className="w-4 h-4 my-auto cursor-pointer"
            alt="Edit"
          />
        </div>
        <div className="p-4">
          {data.length > 0 ? (
            <div className="text-white space-y-2">
              <p>
                <span className="text-gray-400">birthday:</span>{" "}
                {formatDate(data[0].brithday)} (Age:{" "}
                {calculateAge(data[0].brithday)})
              </p>
              <p>
                <span className="text-gray-400">Horoscope:</span>{" "}
                {data[0].horoscope}
              </p>
              <p>
                <span className="text-gray-400">Zodiac:</span> {data[0].zodiac}
              </p>
              <p>
                <span className="text-gray-400">Height:</span> {data[0].height}{" "}
                cm
              </p>
              <p>
                <span className="text-gray-400">Weight:</span> {data[0].weight}{" "}
                kg
              </p>
            </div>
          ) : (
            <p className="text-gray-400">
              Add in your details to help others know you better.
            </p>
          )}
        </div>
      </div>
      {edit && <SettingAbout data={data} onSave={handleSave} />}
    </div>
  );
}
