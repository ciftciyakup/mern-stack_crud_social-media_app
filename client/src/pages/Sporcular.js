import { Fragment, useEffect, useMemo, useState } from "react";
import Athletes from "../components/Sporcular/Athletes";
import axios from "axios";
import SearchBox from "../components/Navbar/SearchBar/SearchBox";
import { useLocation } from "react-router-dom";

const Sporcular = () => {
  const [maleAthletes, setMaleAthletes] = useState([]);
  const [femaleAthletes, setFemaleAthletes] = useState([]);
  const [athleteType, setAthleteType] = useState("");
  const [title, setTitle] = useState("");

  const location = useLocation();

  const params = useMemo(
    () => ({
      userType: "athlete",
      athleteType: athleteType,
      fields: "username,fullname,avatar,athleteType",
    }),
    [athleteType] // Yalnızca athleteType değiştiğinde params'ı yeniden oluşturun
  );

  useEffect(() => {
    if (location.pathname === "/sporcularimiz") {
      setMaleAthletes([]);
      setFemaleAthletes([]);
      setAthleteType("kulup");
      setTitle("Sporcularımız");
    }
    if (location.pathname === "/milli_sporcularimiz") {
      setMaleAthletes([]);
      setFemaleAthletes([]);
      setAthleteType("milli");
      setTitle("Milli Sporcularımız");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Erkek sporcular için istek
    axios
      .get("/athletes", {
        params: {
          ...params, // İlk paramleri yayın
          gender: "erkek", // Erkek sporcular için cinsiyet ekleyin
          limit: 7,
          fields: `${params.fields},weight`, // Mevcut alanlara "ağırlık" ekleyin
        },
      })
      .then((response) => {
        setMaleAthletes(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching male athletes:", error);
      });

    // Kadın sporcular için istek
    axios
      .get("/athletes", {
        params: {
          ...params, // İlk paramleri yayın
          gender: "kadin", // Kadın sporcular için cinsiyet ekleyin
          limit: 7,
          fields: `${params.fields},weight`, // Mevcut alanlara "ağırlık" ekleyin
        },
      })
      .then((response) => {
        setFemaleAthletes(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching female athletes:", error);
      });
  }, [params]);

  return (
    <Fragment>
      <div className="container mx-auto sm:px-4 pt-12">
        <h1 className="mb-6 text-center tracking-wider text-[2rem] font-medium leading-5 max-[425px]:leading-normal">
          {title.toLocaleUpperCase("TR")}
        </h1>
      </div>
      <div className="container mx-auto sm:px-4">
        <div className="mb-12 flex flex-wrap justify-center">
          <SearchBox params={params} />
        </div>
      </div>
      <div className="bg-[url('./img/low-poly-grid-haikei.png')] bg-cover pt-6">
        <div className="container mx-auto">
          <div className="xl:px-20">
            <div className="flex justify-center flex-wrap">
              <Athletes title={`Erkek ${title}`} athletes={maleAthletes} />
              <Athletes title={`Kadın ${title}`} athletes={femaleAthletes} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sporcular;
