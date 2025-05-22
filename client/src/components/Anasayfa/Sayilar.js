import React from "react";
import { Container, Grid, Typography, Paper } from "@mui/material";
import CountUp from "react-countup";
import antrenor from "../../img/antrenor.png";
import milliSporcu from "../../img/milliSporcu.png";
import aktifSporcu from "../../img/aktifSporcu.png";
import kulup from "../../img/kulup.png";
import lisanslıSporcu from "../../img/lisanslıSporcu.png";
import salon from "../../img/salon.png";
import olimpiyat from "../../img/olimpiyat.svg";
import tohm from "../../img/tohm.png";
import sem from "../../img/sem.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // i18next hook'u

const Sayilar = () => {
  const { t } = useTranslation(); // useTranslation hook'u

  return (
    <Paper className="bg-kagit-900 text-white py-5">
      <Container>
        <Typography variant="h4" align="center" gutterBottom className="mb-5">
          {t("numbers_with_kocaeli_judo")} {/* Çeviri metni */}
        </Typography>
        <Grid container justifyContent="center" spacing={3}>
          {[
            {
              image: antrenor,
              end: 25,
              label: t("coach"), // Çeviri metni
              to: "/antrenorlerimiz",
            },
            {
              image: milliSporcu,
              end: 10,
              label: t("national_athlete"), // Çeviri metni
              to: "/milli_sporcularimiz",
            },
            {
              image: aktifSporcu,
              end: 100,
              label: t("active_athlete"), // Çeviri metni
              to: "/sporcularimiz",
            },
            {
              image: lisanslıSporcu,
              end: 15,
              label: t("licensed_athlete"), // Çeviri metni
              to: "/sporcularimiz",
            },
            {
              image: olimpiyat,
              end: 1,
              label: t("olympic_pool_athlete"), // Çeviri metni
              to: "/milli_sporcularimiz",
            },
            {
              image: tohm,
              end: 1,
              label: t("tohm_athlete"), // Çeviri metni
              to: "/milli_sporcularimiz",
            },
            {
              image: sem,
              end: 1,
              label: t("sem_athlete"), // Çeviri metni
              to: "/sporcularimiz",
            },
            { image: kulup, end: 5, label: t("club") }, // Çeviri metni
            { image: salon, end: 3, label: t("hall") }, // Çeviri metni
          ].map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} className="text-center">
              <Link to={item.to}>
                <div className="p-6 mb-6 bg-kagit-900 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 max-sm:hover:scale-102.5 transition-transform duration-300">
                  <img src={item.image} alt={item.label} className="w-32 h-32 mx-auto mb-4" />
                  <CountUp
                    enableScrollSpy
                    scrollSpyDelay={200}
                    end={item.end}
                    duration={3}
                    className="text-4xl font-bold"
                  />
                  <span className="text-xl block">{item.label}</span>
                </div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Paper>
  );
};

export default Sayilar;
