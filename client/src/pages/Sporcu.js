import React, { useEffect, useState } from "react";
import { BASE_PROFILE_IMAGE_URL } from "../utils/constants";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const Sporcu = () => {
  const params = useParams();
  const [athlete, setAthlete] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/user/${params.sporcu}`, {
          params: {
            username: params.sporcu,
            fields: "gender,weight,athleteType,achievements",
          },
        });
        setAthlete(data.user);
      } catch (error) {
        console.error("Sporcu getirme hatası: ", error);
      }
    })();
  }, [params.sporcu]);

  return (
    <div className="container flex-grow mx-auto sm:px-4 flex items-center my-6">
      <div className="flex flex-wrap justify-center">
        <div className="md:w-1/4 px-4 xl:w-1/6 mb-4">
          <div className="flex flex-wrap justify-center">
            <div className="relative flex-grow max-w-full px-4 sm:w-full">
              <img
                src={BASE_PROFILE_IMAGE_URL + athlete?.avatar}
                alt={athlete?.fullname}
                className="w-full h-auto mb-6 mx-auto"
              />
            </div>
            <div className="relative flex-grow max-w-full px-4 sm:w-full">
              <div className="text-center">
                <img
                  alt="Türkiye (TUR)"
                  src="https://judobase.ijf.org/assets/img/flags/r-320x240/tur.png"
                  className="max-w-full h-auto mb-2 mx-auto"
                />
                Türkiye (TUR)
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-3/4 px-4 xl:w-5/6 text-left">
          <div className="flex justify-between">
            <h3 className="mb-2 tracking-widest text-[1.4rem] font-medium leading-[1.2]">
              {athlete?.fullname}
            </h3>
            <Button
              variant="contained"
              sx={{ textTransform: "none", mb: 2 }}
              onClick={() => window.history.back()}
            >
              Geri
            </Button>
          </div>
          <div className="block w-full overflow-x-auto scrolling-touch mb-6">
            <table className="w-full mb-4 border-collapse border-gray-500 border-spacing-[2px]">
              <tbody className="leading-7">
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    Cinsiyet
                  </th>
                  <td
                    className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light"
                    width="100%"
                  >
                    {athlete?.gender?.charAt(0).toUpperCase() +
                      athlete?.gender?.slice(1) || ""}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    Siklet
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {athlete?.weight}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    Sporcu Türü
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {athlete?.athleteType === "milli"
                      ? "Milli Sporcu"
                      : "Kulüp Sporcusu"}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    Ülke
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    Türkiye (TUR)
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    Kulüp
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    Kocaeli Büyükşehir Belediye Kağıtspor Kulübü
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    Başarılar
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {athlete?.achievements?.map((achievement, index) => (
                      <li key={index} className="list-['-_']">
                        {achievement}
                      </li>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sporcu;
