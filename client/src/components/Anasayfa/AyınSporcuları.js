import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import tunahanTutar from "../../img/tunahanTutar.png";
import { Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

const AyınSporcuları = () => {
  return (
    <Container className="p-6">
      <Typography align="center" variant="h4" className="mb-5">
        Ayın Sporcuları
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-4">
          <Card className="max-w-sm border m-auto p-2 shadow-lg hover:shadow-xl transform hover:scale-102.5 transition-transform duration-300">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Omer_aydin_judo.jpg/800px-Omer_aydin_judo.jpg"
              className="w-full aspect-square object-cover"
            />
            <CardContent>
              <Typography variant="h6">Ömer Kemal Aydın</Typography>
              <ul>
                <li>🥉 Gençlik Olimpiyatları 2018 - Buenos Aires, Arjantin</li>
                <li>
                  🥈 Ümitler Avrupa Şampiyonası 2018 - Saraybosna, Bosna Hersek
                </li>
                <li>🥉 Ümitler Dünya Şampiyonası 2017 - Santiago, Şili</li>
                <li>
                  🥉 Avrupa Gençlik Olimpik Oyunları 2017 - Erzurum, Türkiye
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col">
          <Card className="max-w-sm border mx-auto p-2 shadow-lg hover:shadow-xl transform hover:scale-102.5 max-sm:hover:scale-102.5 transition-transform duration-300">
            <img
              src={tunahanTutar}
              className="w-full aspect-square object-cover"
            />
            <CardContent>
              <Typography variant="h6">Tunahan Tutar</Typography>
              <ul>
                <li>🥈 Büyükler Balkan Şampiyonası 2023 - Peja, Kosova</li>
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
              Sporcularımız
            </Button>
            <Button
              component={Link}
              to={"/milli_sporcularimiz"}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Milli Sporcularımız
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AyınSporcuları;
