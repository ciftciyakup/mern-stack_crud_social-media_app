import React from "react";
import Sidebar from "./Sidebar";

const Update = ({ children, activeTab }) => {
  return (
    <>
      <div className="my-24 max-[600px]:mt-[136px] max-[540px]:mt-40 xl:w-2/3 mx-auto sm:pr-14 sm:pl-8">
        <div className="flex border rounded w-full bg-white">
          <Sidebar activeTab={activeTab} />
          {children}
        </div>
      </div>
    </>
  );
};

export default Update;
