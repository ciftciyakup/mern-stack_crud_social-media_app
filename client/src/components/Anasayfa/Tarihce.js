import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // i18next hook'u

const Tarihce = () => {
  const { t } = useTranslation(); // useTranslation hook'u

  return (
    <Container maxWidth={false} className="bg-kagit-900 text-white py-8">
      <Grid container justifyContent="center">
        <Grid item lg={10} xl={8} className="text-center">
          <Typography variant="h2" className="text-4xl font-semibold mb-6">
            {t("history_title")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="whitespace-pre-wrap break-words text-lg mb-6">
            {t("history_intro")} {/* Çeviri metni */}
          </Typography>
          <Typography
            variant="h2"
            component="h2"
            className="text-xl font-bold text-text-100 mt-1 -mb-0.5"
          >
            {t("history_early_years")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="whitespace-pre-wrap break-words text-lg mb-6">
            {t("history_early_years_text_1")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="whitespace-pre-wrap break-words text-lg mb-6">
            {t("history_early_years_text_2")} {/* Çeviri metni */}
          </Typography>
          <Button
            component={Link}
            to={"/tarihce"}
            variant="outlined"
            className="bg-white text-kagit-900 px-6 py-2 rounded-full hover:bg-opacity-80 transition duration-300"
          >
            {t("read_more")} {/* Çeviri metni */}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tarihce;
