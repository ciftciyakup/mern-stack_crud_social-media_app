import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next"; // i18next hook'u

const Tarihce = () => {
  const { t } = useTranslation(); // useTranslation hook'u

  return (
    <Container maxWidth={false}>
      <Grid
        container
        justifyContent="center"
        className="min-h-[calc(100vh-96px)]"
        alignItems="center"
      >
        <Grid item lg={10} xl={8} className="text-center py-6">
          <Typography variant="h2" className="text-4xl font-semibold mb-6">
            {t("history_title")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("history_intro")} {/* Çeviri metni */}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            className="text-xl font-bold text-text-100 mt-1 -mb-0.5"
          >
            {t("history_early_years")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("history_early_years_text_1")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("history_early_years_text_2")} {/* Çeviri metni */}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            className="text-xl font-bold text-text-100 mt-1 -mb-0.5"
          >
            {t("development_period")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("development_period_text_1")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("development_period_text_2")} {/* Çeviri metni */}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            className="text-xl font-bold text-text-100 mt-1 -mb-0.5"
          >
            {t("success_and_international_representation")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("success_and_international_representation_text_1")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("success_and_international_representation_text_2")} {/* Çeviri metni */}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            className="text-xl font-bold text-text-100 mt-1 -mb-0.5"
          >
            {t("current_kocaeli_judo")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("current_kocaeli_judo_text_1")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("current_kocaeli_judo_text_2")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("current_kocaeli_judo_text_3")} {/* Çeviri metni */}
          </Typography>
          <Typography paragraph className="text-lg mb-6">
            {t("conclusion")} {/* Çeviri metni */}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Tarihce;
