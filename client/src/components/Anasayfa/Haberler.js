import React from "react";
import { Container, Grid, Button, Typography } from "@mui/material";
import formatDate from "../../utils/formatDate";
import { Link } from "react-router-dom";
import { BASE_NEWS_IMAGE_URL } from "../../utils/constants";
import { useTranslation } from "react-i18next"; // i18next hook'u

const Haberler = ({ newsList }) => {
  const { t } = useTranslation(); // useTranslation hook'u

  return (
    <Container>
      <Typography
        variant="h2"
        component="h1"
        className="text-center my-8 text-4xl font-extrabold text-kagit-900"
      >
        {t("news")} {/* Çeviri metni */}
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {newsList.map((news, index) => (
          <Grid item key={index} xs={12} sm={6} md={5} lg={3}>
            <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-105">
              <Link to={`/haberler/${news.url}`}>
                <img
                  src={BASE_NEWS_IMAGE_URL + news.image}
                  alt={news.title}
                  className="w-full h-72 object-cover rounded-t-lg"
                />
                <div className="p-4 h-36">
                  <Typography
                    variant="h3"
                    component="h2"
                    className="text-xl font-semibold mb-2 text-kagit-900"
                  >
                    {news.title}
                  </Typography>
                  <p className="text-gray-600 text-sm">{formatDate(news.date)}</p>
                </div>
              </Link>
            </div>
          </Grid>
        ))}
      </Grid>
      <div className="text-center my-8">
        <Button
          component={Link}
          to="/haberler"
          variant="contained"
          color="primary"
          className="px-8 py-4 text-lg font-semibold rounded-full bg-kagit-800 hover:bg-kagit-900 transition-transform duration-300 hover:scale-105"
        >
          {t("all_news")} {/* Çeviri metni */}
        </Button>
      </div>
    </Container>
  );
};

export default Haberler;
