import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import logo from "../../img/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-6 pb-4">
      <Container>
        <Grid container justifyContent="center" spacing={6}>
          <Grid item md={4} xs={12} className="text-center mb-8 md:mb-0">
            <img
              src={logo}
              alt="Logo"
              height={40}
              width={40}
              className="mb-4 mx-auto"
            />
            <Typography variant="body1" className="text-gray-300">
              Kocaeli Judo'nun resmi internet sitesidir. Burada Kocaeli Judo ile
              ilgili güncel bilgilere ve etkinliklere ulaşabilirsiniz.
            </Typography>
          </Grid>
          <Grid item md={4} xs={12} className="text-center mb-8 md:mb-0">
            <Typography variant="h5" className="mb-4 text-yellow-400">
              İletişim
            </Typography>
            <ul className="list-none pl-0 text-gray-300">
              <li className="mb-2">
                Adres: Kozluk Mahallesi Sümer Sokak No:5, Seka Sporcu Eğitim
                Merkezi, Kocaeli
              </li>
              <li className="mb-2">Telefon: 123-456-7890</li>
              <li>E-posta: info@kocaelijudo.com</li>
            </ul>
          </Grid>
          <Grid item md={4} xs={12} className="text-center">
            <Typography variant="h5" className="mb-4 text-yellow-400">
              Sosyal Medya
            </Typography>
            <div className="flex justify-center space-x-6">
              <IconButton
                href="https://www.facebook.com/kocaelijudo"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <Facebook fontSize="large" />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/kocaelijudo"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <Instagram fontSize="large" />
              </IconButton>
              <IconButton
                href="https://www.twitter.com/kocaelijudo"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <Twitter fontSize="large" />
              </IconButton>
            </div>
          </Grid>
        </Grid>
        <hr className="bg-yellow-400 mt-6 mb-4" />
        <Grid container justifyContent="center">
          <Grid item md={6} xs={12} className="text-center">
            <Typography variant="body2" className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Kocaeli Judo. Tüm Hakları
              Saklıdır.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
