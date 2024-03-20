import React from "react";
import { Container, Grid, Typography, Paper } from "@mui/material";
import CountUp from "react-countup";
import antrenor from "../../img/antrenor.png";
import milliSporcu from "../../img/milliSporcu.png";
import aktifSporcu from "../../img/aktifSporcu.png";
import kulup from "../../img/kulup.png";
import lisanslıSporcu from "../../img/lisanslıSporcu.png";
import salon from "../../img/salon.png";
import { Link } from "react-router-dom";

const Sayilar = () => {
  return (
    <Paper className="bg-kagit-900 text-white py-5">
      <Container>
        <Typography variant="h4" align="center" gutterBottom className="mb-5">
          Sayılarla Kocaeli Judo
        </Typography>
        <Grid container justifyContent="center" spacing={3}>
          {[
            {
              image: antrenor,
              end: 25,
              label: "Antrenör",
              to: "/antrenorlerimiz",
            },
            {
              image: milliSporcu,
              end: 10,
              label: "Milli Sporcu",
              to: "/milli_sporcularimiz",
            },
            {
              image: aktifSporcu,
              end: 100,
              label: "Aktif Sporcu",
              to: "/sporcularimiz",
            },
            {
              image: lisanslıSporcu,
              end: 15,
              label: "Lisanslı Sporcu",
              to: "/sporcularimiz",
            },
            { image: kulup, end: 5, label: "Kulüp" },
            { image: salon, end: 3, label: "Salon" },
          ].map((item, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              className="text-center"
            >
              <Link to={item.to}>
                <div className="p-6 mb-6 bg-kagit-900 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 max-sm:hover:scale-102.5 transition-transform duration-300">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-32 h-32 mx-auto mb-4"
                  />
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
