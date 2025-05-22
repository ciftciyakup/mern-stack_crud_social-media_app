import React, { useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { BASE_NEWS_IMAGE_URL } from "../../utils/constants";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ArrowRightIcon
      fontSize="large"
      className={`${className} text-kagit-900 hover:bg-white`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <ArrowLeftIcon
      fontSize="large"
      className={`${className} text-kagit-900 hover:bg-white`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
}

function CustomSlider({ newsList }) {
  const [index, setIndex] = useState(0);

  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    initialSlide: index,
    autoplay: true,
    afterChange: (currentIndex) => {
      setIndex(currentIndex);
    },
  };

  return (
    <Slider {...settings}>
      {newsList.map((news) => (
        <div key={news._id} className="relative overflow-hidden">
          <Link to={`/haberler/${news.url}`}>
            <img
              src={BASE_NEWS_IMAGE_URL + news.image}
              alt={news.title}
              className="w-full h-[calc(100vh-96px)] object-cover transform hover:scale-105 transition duration-300 object-top"
            />
          </Link>
          <Link
            to={`/haberler/${news.url}`}
            className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent"
          >
            <h3 className="text-3xl font-semibold text-white text-center">
              {news.title}
            </h3>
          </Link>
        </div>
      ))}
    </Slider>
  );
}

export default CustomSlider;
