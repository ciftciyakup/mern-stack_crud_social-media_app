import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CustomNavbar from "./components/Navbar/CustomNavbar";
import Anasayfa from "./pages/Anasayfa";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import "emoji-mart/css/emoji-mart.css";
import KayıtOl from "./pages/KayıtOl";
import GirisYap from "./pages/GirisYap";
import Haberler from "./pages/Haberler";
import { Fragment, Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./slices/userSlice";
import Dogrulama from "./pages/Dogrulama";
import Haber from "./pages/Haber";
import Header from "./components/Navbar/Header";
import PrivateRoute from "./Routes/PrivateRoute";
import Profile from "./components/User/Profile";
import UpdateProfile from "./components/User/Update/UpdateProfile";
import UpdatePassword from "./components/User/Update/UpdatePassword";
import SpinLoader from "./components/Layouts/SpinLoader";
import Tarihce from "./pages/Tarihce";
import Sporcular from "./pages/Sporcular";
import Sporcu from "./pages/Sporcu";

const Home = lazy(() => import("./components/Home/Home"));
const ForgotPassword = lazy(() => import("./components/User/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/User/ResetPassword"));
const Update = lazy(() => import("./components/User/Update/Update"));
const NotFound = lazy(() => import("./components/Errors/NotFound"));

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const isVerified = useSelector((state) => state?.user?.user?.isVerified);
  const navigate = useNavigate();
  const location = useLocation();

  const isSocial = location.pathname.startsWith("/sosyal");

  // Her zaman rota/yol değişikliğinde en üste kaydır
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      dispatch(loadUser())
        .unwrap()
        .then((data) => {
          if (
            (data?.user?.userType === "coach" ||
              data?.user?.userType === "athlete") &&
            data?.user?.isVerified &&
            (location.pathname === "/" || location.pathname === "/login")
          ) {
            navigate("/sosyal");
          } else {
            navigate(location.pathname);
          }
        })
        .catch((error) => {
          console.error("Giriş hatası:", error);
        });
    }
    if (
      (user?.userType === "coach" || user?.userType === "athlete") &&
      isVerified &&
      (location.pathname === "/" || location.pathname === "/login")
    ) {
      navigate("/sosyal");
    } else {
      navigate(location.pathname);
    }
  }, []);

  return (
    <Suspense fallback={<SpinLoader />}>
      {isVerified !== false ? (
        <Fragment>
          <div className="flex flex-col min-h-screen">
            {isSocial ? (
              <PrivateRoute>
                <Header />
              </PrivateRoute>
            ) : (
              <CustomNavbar />
            )}
            <Routes>
              <Route exact path="/" element={<Anasayfa />} />
              <Route
                path="/haberler"
                element={<Haberler />}
                preventScrollReset={true}
              />
              <Route path="/haberler/:url" element={<Haber />} />
              <Route path="/tarihce" element={<Tarihce />} />
              <Route path="/milli_sporcularimiz" element={<Sporcular />} />
              <Route path="/milli_sporcularimiz/:sporcu" element={<Sporcu />} />
              <Route path="/sporcularimiz" element={<Sporcular />} />
              <Route path="/sporcularimiz/:sporcu" element={<Sporcu />} />
              <Route path="/signup" element={<KayıtOl />} />
              <Route path="/login" element={<GirisYap />} />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/password/reset/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/sosyal"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sosyal/:username"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/sosyal/accounts/edit"
                element={
                  <PrivateRoute>
                    <Update activeTab={0}>
                      <UpdateProfile />
                    </Update>
                  </PrivateRoute>
                }
              />
              <Route
                path="/sosyal/accounts/password/change"
                element={
                  <PrivateRoute>
                    <Update activeTab={1}>
                      <UpdatePassword />
                    </Update>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
          {!isSocial && <Footer />}
        </Fragment>
      ) : (
        <Routes>
          <Route path="*" element={<Dogrulama />} />
        </Routes>
      )}
      <Toaster position="top-center" />
    </Suspense>
  );
}

export default App;
