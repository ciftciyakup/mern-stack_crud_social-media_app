import React, { useEffect, useState } from "react";
import { BASE_PROFILE_IMAGE_URL } from "../utils/constants";
import { Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import turkiyeFlag from "../img/turkiye-flag.png";
import { useTranslation } from "react-i18next"; // i18next hook'u

const Sporcu = () => {
  const { t } = useTranslation(); // useTranslation hook'u
  const params = useParams();
  const [athlete, setAthlete] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/user/${params.sporcu}`, {
          params: {
            username: params.sporcu,
            fields: "fullname avatar gender weight athleteType achievements",
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
                  alt={t("country")}
                  src={turkiyeFlag}
                  className="max-w-full h-auto mb-2 mx-auto"
                />
                {t("country_name")}
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
              {t("back")}
            </Button>
          </div>
          <div className="block w-full overflow-x-auto scrolling-touch mb-6">
            <table className="w-full mb-4 border-collapse border-gray-500 border-spacing-[2px]">
              <tbody className="leading-7">
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    {t("gender")}
                  </th>
                  <td
                    className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light"
                    width="100%"
                  >
                    {athlete?.gender ? t(athlete?.gender.toLowerCase()) : ""}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    {t("weight")}
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {athlete?.weight}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    {t("athlete_type")}
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {athlete?.athleteType === "milli"
                      ? t("national_athlete")
                      : t("club_athlete")}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    {t("country")}
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {t("country_name")}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    {t("club")}
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {t("club_name")}
                  </td>
                </tr>
                <tr>
                  <th className="whitespace-nowrap p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem]">
                    {t("achievements")}
                  </th>
                  <td className="p-[0.3rem] align-top border-t border-solid border-gray-200 tracking-[0.03125rem] font-light">
                    {athlete?.achievements?.map((achievement, index) => (
                      <li key={index} className="list-['-_']">
                        {achievement.year} {achievement.category} {achievement.competition}{" "}
                        {achievement.weight} {achievement.place}
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
