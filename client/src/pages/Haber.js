import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Container, Grid } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import formatDate from "../utils/formatDate";
import { getOneNews } from "../slices/newsSlice";
import { showDeleteModal, showEditModal } from "../slices/modalSlice";
import HaberModal from "../components/Modals/HaberModal";
import { BASE_NEWS_IMAGE_URL } from "../utils/constants";

const Haber = () => {
  const { url } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getOneNews(url));
    return () => {
      dispatch(getOneNews(null));
    };
  }, [dispatch, url]);

  const news = useSelector((state) => state.news.news);
  const updateNews = useSelector((state) => state.news.updateNews);

  useEffect(() => {
    if (updateNews) {
      dispatch(getOneNews(url));
      navigate(`/haberler/${news.url}`);
    } // eslint-disable-next-line
  }, [updateNews, dispatch, url]);

  const handleEdit = (url) => {
    if (user?.userType === "admin") {
      dispatch(showEditModal({ url }));
    }
  };

  const handleDelete = (url, title) => {
    if (user?.userType === "admin") {
      dispatch(showDeleteModal({ url, title }));
    }
  };

  return (
    <Container>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
        mt={0}
      >
        <Grid item md={8} display="flex" className="pt-6 space-x-2">
          <Typography variant="h4" align="center" gutterBottom className="grow">
            {news?.title}
          </Typography>
          {user?.userType === "admin" && (
            <div className="flex items-center space-x-2 shrink-0 mb-2">
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => handleEdit(news.url)}
              >
                Düzenle
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(news.url, news.title)}
              >
                Sil
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        className="mt-3 mb-8"
      >
        <Grid item md={8}>
          <img
            src={BASE_NEWS_IMAGE_URL + news?.image}
            alt="Haber Görseli"
            className="img-fluid mb-3 rounded-md"
          />
          <Typography
            variant="subtitle1"
            align="left"
            gutterBottom
            color="textSecondary"
          >
            {formatDate(news?.date)}
          </Typography>
          <div
            className="mt-3"
            dangerouslySetInnerHTML={{ __html: news?.content }}
          ></div>
        </Grid>
      </Grid>
      <HaberModal />
    </Container>
  );
};

export default Haber;
