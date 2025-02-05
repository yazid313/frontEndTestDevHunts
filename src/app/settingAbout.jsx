import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingAbout({ data, onSave }) {
  const [formData, setFormData] = useState(data[0] || {});
  const [image, setImage] = useState("");
  const [id, setId] = useState(1);
  const router = useRouter();

  //masalah nya ada pada gambar dan id ketika create
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decode = jwtDecode(token);
      setId(decode.id);
    } catch (error) {
      console.error("Token tidak valid:", error);
      router.push("/");
    }
  }, [router.push]);

  const getHoroscope = (date) => {
    const month = new Date(date).getMonth() + 1;
    const day = new Date(date).getDate();

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return "Aquarius";
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20))
      return "Pisces";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
      return "Gemini";
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
      return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
      return "Libra";
    if ((month === 10 && day >= 24) || (month === 11 && day <= 21))
      return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return "Capricorn";
    return "";
  };

  const getZodiac = (date) => {
    const year = new Date(date).getFullYear();
    const zodiacs = [
      "Monkey",
      "Rooster",
      "Dog",
      "Pig",
      "Rat",
      "Ox",
      "Tiger",
      "Rabbit",
      "Dragon",
      "Snake",
      "Horse",
      "Goat",
    ];
    return zodiacs[year % 12];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = { ...formData, [name]: value };
    console.log(name === "birthday");

    if (name === "birthday" && value) {
      updatedData.horoscope = getHoroscope(value);
      updatedData.zodiac = getZodiac(value);
    }

    setFormData(updatedData);
  };

  const handleSave = async () => {
    const savedToken = localStorage.getItem("accessToken");
    if (!id) {
      alert("User ID tidak ditemukan");
      return;
    }

    try {
      const formDataToSend = new FormData();

      if (image) {
        formDataToSend.append("photo", image);
      } else {
        formDataToSend.append("photo", data[0].photo);
      }

      if (data.length === 0) {
        formDataToSend.append("user_id", id);
      }
      Object.keys(formData).forEach((key) => {
        if (key !== "photo") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Fungsi untuk mengirim data dengan metode PUT
      const updateData = async () => {
        return await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/about/updateAbout/${data[0].id}`,
          formDataToSend,
          {
            headers: {
              Authorization: "Bearer " + savedToken,
            },
          }
        );
      };

      // Fungsi untuk mengirim data dengan metode POST
      const createData = async () => {
        return await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/about/createAbout`,
          formDataToSend,
          {
            headers: {
              Authorization: "Bearer " + savedToken,
            },
          }
        );
      };

      if (data.length > 0) {
        await updateData();
        window.location.reload();
      } else {
        await createData();
        window.location.reload();
      }

      onSave(data);
      alert("Data berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan data:", error.message || error);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <div className="p-4 max-w-[360px] bg-bck mx-auto rounded">
      <div className="flex justify-between mb-4">
        <h1 className="text-white text-lg font-bold">About</h1>
        <button
          onClick={handleSave}
          className="text-yellow-400 font-medium cursor-pointer"
        >
          Save & Update
        </button>
      </div>
      <div className="flex gap-2 mb-[29px]">
        <div>
          <input
            type="file"
            id="file-upload"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
            required
          />
          <label
            htmlFor="file-upload"
            className="pt-[6px] bg-regal-gray p-2 rounded-lg cursor-pointer flex items-center justify-center"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-16 h-16 object-cover"
              />
            ) : (
              <img
                src={`${
                  data.length > 0
                    ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${data[0].photo}`
                    : "/images/Union.png"
                }`}
                alt="default"
                className="w-9 h-9 object-cover"
              />
            )}
          </label>
        </div>
        <p className="text-white my-auto">Add image</p>
      </div>

      <form className="text-white space-y-4">
        {[
          {
            label: "Display Name",
            name: "display_name",
            type: "text",
            placeholder: "Enter Name",
          },
          {
            label: "Gender",
            name: "gender",
            type: "select",
            options: ["male", "female"],
          },
          { label: "Birthday", name: "birthday", type: "date" },
          {
            label: "Horoscope",
            name: "horoscope",
            type: "text",
            readOnly: true,
          },
          {
            label: "Zodiac",
            name: "zodiac",
            type: "text",
            readOnly: true,
          },
          {
            label: "Height",
            name: "height",
            type: "number",
            placeholder: "Add Height",
          },
          {
            label: "Weight",
            name: "weight",
            type: "number",
            placeholder: "Add Weight",
          },
        ].map((field, index) =>
          field.type === "select" ? (
            <div key={index} className="flex items-center gap-2">
              <label htmlFor={field.name} className="text-regal-gray w-28">
                {field.label}:
              </label>
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="h-[36px] w-full rounded-lg p-2 bg-regal-gray text-end"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div key={index} className="flex items-center gap-2">
              <label htmlFor={field.name} className="text-regal-gray w-28">
                {field.label}:
              </label>

              <input
                type={field.type}
                id={field.name}
                name={field.name}
                placeholder={field.placeholder || ""}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="h-[36px] w-full rounded-lg p-2 bg-regal-gray text-end"
                readOnly={field.readOnly || false}
              />
            </div>
          )
        )}
      </form>
    </div>
  );
}
