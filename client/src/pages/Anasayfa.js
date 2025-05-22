import { Fragment, useEffect } from "react";
import Haberler from "../components/Anasayfa/Haberler";
import Sayilar from "../components/Anasayfa/Sayilar";
import Slider from "../components/Anasayfa/Slider";
import AyınSporcuları from "../components/Anasayfa/AyınSporcuları";
import Tarihce from "../components/Anasayfa/Tarihce";
import { useDispatch, useSelector } from "react-redux";
import { getNews } from "../slices/newsSlice";

function Anasayfa() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getNews({ fields: "url title image date", currentPage: 1, limit: 8 })
    );
  }, [dispatch]);

  const { newsList } = useSelector((state) => state.news);

  return (
    <Fragment>
      <Slider newsList={newsList.slice(0, 4)} />
      <Haberler newsList={newsList.slice(4)} />
      <Tarihce />
      <AyınSporcuları />
      <Sayilar />
    </Fragment>
  );
}

export default Anasayfa;
