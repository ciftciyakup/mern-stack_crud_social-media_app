import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();

  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Eğer kullanıcı "turnuvaKayit" ise ve sosyal rotasına erişmeye çalışıyorsa, ana sayfaya yönlendir
  if (
    !loading &&
    user?.userType === "turnuvaKayit" &&
    location.pathname.startsWith("/sosyal")
  ) {
    return <Navigate to="/" replace />;
  }

  // Kullanıcı yetkiliyse, çocuk bileşenleri render et
  return children;
};

export default PrivateRoute;
