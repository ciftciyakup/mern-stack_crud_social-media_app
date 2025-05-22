import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const NotFound = () => {
  const isAuthenticated = useSelector((state) => state?.user?.isAuthenticated);
  const location = useLocation();

  const [isSocial, setIsSocial] = useState();

  useEffect(() => {
    if (location.pathname.startsWith("/sosyal") && isAuthenticated) {
      setIsSocial(true);
    } else {
      setIsSocial(false);
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center m-4">
      <h1 className="text-2xl font-medium">Maalesef bu sayfa mevcut değil.</h1>
      <p className="text-md">
        Takip ettiğiniz bağlantı bozulmuş veya sayfa kaldırılmış olabilir.
        <Link to={isSocial ? "/sosyal" : "/"} className="text-blue-900">
          {" "}
          Anasayfaya geri dön.
        </Link>
      </p>
      <Link
        to={isSocial ? "/sosyal" : "/"}
        className="bg-primary-blue px-4 py-2 text-white font-medium rounded hover:drop-shadow-lg"
      >
        Anasayfaya Git
      </Link>
    </div>
  );
};

export default NotFound;
