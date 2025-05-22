import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Pagination,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { getNews } from "../slices/newsSlice";
import { Edit, Delete } from "@mui/icons-material"; // Material UI ikonlarını içe aktarın
import { showAddModal, showDeleteModal, showEditModal } from "../slices/modalSlice";
import HaberModal from "../components/Modals/HaberModal";
import formatDate from "../utils/formatDate";
import { BASE_NEWS_IMAGE_URL } from "../utils/constants";
import { useTranslation } from "react-i18next";

const Haberler = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");
  const { newsList, status, updateNewsList } = useSelector((state) => state.news);
  const user = useSelector((state) => state.user.user);
  const itemsPerPage = 6;
  const currentPage = useSelector((state) => state.news.currentPage);
  const totalPages = useSelector((state) => state.news.totalPages);
  const smallDevice = useMediaQuery("(max-width:425px)");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); // Sayfa yüklendiğinde en üste çık
    dispatch(
      getNews({
        fields: "url title image date",
        currentPage: page || 1,
        limit: itemsPerPage,
      })
    );
  }, [dispatch, page]);

  useEffect(() => {
    if (updateNewsList) {
      dispatch(
        getNews({
          fields: "url title image date",
          currentPage,
          limit: itemsPerPage,
        })
      );
    }
  }, [updateNewsList, dispatch, currentPage]);

  const handlePageChange = (event, pageNumber) => {
    navigate(`/haberler?page=${pageNumber}`);
  };

  if (status === "loading") {
    return <Container className="mt-6">Yükleniyor...</Container>;
  }

  const handleAddNews = () => {
    if (user?.userType === "admin") {
      dispatch(showAddModal());
    }
  };

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
    <Container className="flex flex-col grow justify-center">
      <div className="flex items-center justify-between mt-6 mb-4">
        <Typography
          variant="h4"
          fontWeight="bold"
          className="max-[375px]:mr-4 grow text-center"
        >
          {t("news")}
        </Typography>
        {user?.userType === "admin" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => handleAddNews()}
            className="normal-case"
          >
            Yeni Haber Ekle
          </Button>
        )}
      </div>
      <Grid container spacing={2} justifyContent="center">
        {newsList.map((news) => (
          <Grid item key={news._id} xs={12} sm={6} md={4}>
            <Card
              component={Link}
              to={`/haberler/${news.url}`}
              className="block h-full shadow-md"
            >
              <Card className="h-full">
                <CardMedia
                  component="img"
                  src={BASE_NEWS_IMAGE_URL + news.image}
                  alt={news.title}
                  className="w-full aspect-[3/2] object-cover"
                />
                <CardContent
                  className={`${
                    user?.userType === "admin" ? "h-44" : ""
                  } grid gap-3 items-center pb-4`}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {news.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(news.date)}
                  </Typography>
                  {user?.userType === "admin" && (
                    <div className="mt-auto flex justify-between items-center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(news.url);
                        }}
                      >
                        <Edit /> {/* FontAwesome ikonları yerine Material UI ikonları */}
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(news.url, news.title);
                        }}
                      >
                        <Delete /> {/* FontAwesome ikonları yerine Material UI ikonları */}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        siblingCount={smallDevice ? 0 : 1}
        className="my-12 flex justify-center"
      />
      <HaberModal />
    </Container>
  );
};

export default Haberler;
