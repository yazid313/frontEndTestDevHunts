import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Interest({ userId }) {
  const [dataInterest, setDataInterest] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");

    if (savedToken) {
      const decoded = jwtDecode(savedToken);
      const user_id = decoded.id;

      const response = async () => {
        try {
          const resData = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interest/getInterestByUserId/${user_id}`
          );
          const data = resData.data;
          if (Array.isArray(data)) {
            setDataInterest(data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      response();
    }
  }, []);

  const toggleEdit = () => {
    router.push("/settingInterest");
  };

  return (
    <>
      <div className="mx-auto w-96">
        <div className="max-w-[359px] relative mx-auto rounded bg-bck">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h1 className="text-white text-lg font-semibold">Interest</h1>
            <img
              onClick={toggleEdit}
              src="/images/toolsedit.png"
              className="w-4 h-4 my-auto cursor-pointer"
              alt="Edit"
            />
          </div>
          <div className="p-4">
            <div
              className={`${
                dataInterest ? "block" : "hidden"
              } mt-4 flex flex-wrap gap-2`}
            >
              {dataInterest &&
                dataInterest.map((item, index) => (
                  <div
                    key={index + 1}
                    className="flex items-center gap-2 px-3 py-1 rounded bg-gray-700 text-center text-white"
                  >
                    {item.my_interest}
                  </div>
                ))}
            </div>
            <p
              className={`${
                dataInterest.length > 0 ? "hidden" : "block"
              } text-gray-400`}
            >
              Add your interests to find a better match
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
