import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // i18next hook'u
import tunahanTutar from "../../img/tunahanTutar.png";

const AyınSporcuları = () => {
  const { t } = useTranslation(); // useTranslation hook'u

  return (
    <Container className="p-6">
      <Typography align="center" variant="h4" className="mb-5">
        {t("athletes_of_the_month")} {/* Çeviri metni */}
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-4">
          <Card className="max-w-sm border m-auto p-2 shadow-lg hover:shadow-xl transform hover:scale-102.5 transition-transform duration-300">
            <img
              alt="Ömer Kemal Aydın"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Omer_aydin_judo.jpg/800px-Omer_aydin_judo.jpg"
              className="w-full aspect-square object-cover"
            />
            <CardContent>
              <Typography variant="h6">Ömer Kemal Aydın</Typography>
              <ul>
                <li>{t("omer_achievement_1")}</li>
                <li>{t("omer_achievement_2")}</li>
                <li>{t("omer_achievement_3")}</li>
                <li>{t("omer_achievement_4")}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col">
          <Card className="max-w-sm border mx-auto p-2 shadow-lg hover:shadow-xl transform hover:scale-102.5 max-sm:hover:scale-102.5 transition-transform duration-300">
            <img
              alt="Tunahan Tutar"
              src={tunahanTutar}
              className="w-full aspect-square object-cover"
            />
            <CardContent>
              <Typography variant="h6">Tunahan Tutar</Typography>
              <ul>
                <li>{t("tunahan_achievement_1")}</li>
              </ul>
            </CardContent>
          </Card>
          <div className="flex justify-center items-center grow max-sm:mt-4 space-x-6">
            <Button
              component={Link}
              to={"/sporcularimiz"}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              {t("athletes")} {/* Çeviri metni */}
            </Button>
            <Button
              component={Link}
              to={"/milli_sporcularimiz"}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              {t("national_athletes")} {/* Çeviri metni */}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AyınSporcuları;
