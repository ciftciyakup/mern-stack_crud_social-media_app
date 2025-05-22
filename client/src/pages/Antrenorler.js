import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_PROFILE_IMAGE_URL } from "../utils/constants";
import { useTranslation } from "react-i18next"; // i18next hook'u

const Antrenorler = () => {
  const { t } = useTranslation(); // useTranslation hook'u
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    axios
      .get("/coaches", {
        params: {
          userType: "coach",
          fields: "username fullname avatar",
        },
      })
      .then((response) => {
        setCoaches(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching coaches:", error);
      });
  }, []);

  return (
    <Fragment>
      <div className="container mx-auto sm:px-4 py-12">
        <h1
          className="mb-6 text-center tracking-wider text-[2rem] font-medium leading-5
                    <max-[425px]:leading-normal"
        >
          {t("our_coaches")} {/* Çeviri metni */}
        </h1>
      </div>
      <div className="bg-[url('./img/low-poly-grid-haikei.png')] bg-cover py-6">
        <div className="container mx-auto">
          <div className="xl:px-20">
            <div className="flex justify-center flex-wrap">
              <div className="px-[15px] w-full relative md:max-w-[50%] md:basis-1/2 md:shrink-0">
                <div className="block bg-white">
                  <div className="coaches">
                    {coaches.map((coach, index) => (
                      <Link key={index} to={`/antrenorlerimiz/${coach.username}`}>
                        <div
                          className="border-b border-gray-300 cursor-pointer mx-0 flex flex-wrap py-2
                        hover:bg-gray-200"
                        >
                          <div
                            className="px-4 items-center flex flex-shrink-0 basis-3/4 max-w-[75%]
                          relative w-full"
                          >
                            <div className="mr-4">
                              <img
                                alt={coach.fullname}
                                src={BASE_PROFILE_IMAGE_URL + coach.avatar}
                                className="w-[3.125rem] h-[3.125rem] object-cover object-top rounded-full
                                border-none"
                              />
                            </div>
                            <div className="grow">{coach.fullname}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Antrenorler;
