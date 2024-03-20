import React from "react";
import { BASE_PROFILE_IMAGE_URL } from "../../utils/constants";
import { Link } from "react-router-dom";

const Athletes = ({ title, athletes }) => {
  return (
    <div className="px-[15px] w-full relative md:max-w-[50%] md:basis-1/2 md:shrink-0 mb-6">
      <div className="block bg-white">
        <div className="py-2 px-4 text-white font-medium text-lg bg-kagit-900">
          {title}
        </div>
        <div className="athletes">
          {athletes.map((athlete, index) => (
            <Link
              key={index}
              to={
                athlete?.athleteType === "milli"
                  ? `/milli_sporcularimiz/${athlete.username}`
                  : `/sporcularimiz/${athlete.username}`
              }
            >
              <div className="border-b border-gray-300 cursor-pointer mx-0 flex flex-wrap py-2 hover:bg-gray-200">
                <div className="pl-4 pr-0 text-kagit-900 whitespace-nowrap items-center flex flex-shrink-0 basis-1/4 max-w-[25%] relative w-full">
                  {athlete.weight}
                </div>
                <div className="pl-0 pr-4 items-center flex flex-shrink-0 basis-3/4 max-w-[75%] relative w-full">
                  <div className="mr-4">
                    <img
                      alt={athlete.fullname}
                      src={BASE_PROFILE_IMAGE_URL + athlete.avatar}
                      className="w-[3.125rem] h-[3.125rem] object-cover object-top rounded-full border-none"
                    />
                  </div>
                  <div className="grow">{athlete.fullname}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Athletes;
