import React from "react";
import { Link } from "react-router-dom";

const tabs = [
  {
    title: "Profili Düzenle",
    nav: "/sosyal/accounts/edit",
  },
  {
    title: "Parolayı Değiştir",
    nav: "/sosyal/accounts/password/change",
  },
];

const Sidebar = ({ activeTab }) => {
  return (
    <div className="hidden sm:flex flex-col border-r w-1/4">
      {tabs.map((el, i) => (
        <Link
          to={el.nav}
          className={`${
            activeTab === i
              ? "border-black text-black border-l-2 font-medium"
              : "hover:border-gray-300 text-gray-600"
          } py-3 px-6 hover:border-l-2 hover:bg-gray-50 cursor-pointer`}
        >
          {el.title}
        </Link>
      ))}

      <div className="flex border-t mt-12 flex-col gap-2 p-6">
        <span className="text-primary-blue font-medium">Hesap Merkezi</span>
      </div>
    </div>
  );
};

export default Sidebar;
