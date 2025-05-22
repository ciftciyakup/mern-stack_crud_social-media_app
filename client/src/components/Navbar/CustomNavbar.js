import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  useMediaQuery,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../img/logo.svg";
import { logoutUser } from "../../slices/userSlice";
import { toast } from "react-hot-toast";
import MenuIcon from "@mui/icons-material/Menu";
import LanguageIcon from "@mui/icons-material/Language"; // Dil simgesi
import { useTranslation } from "react-i18next"; // i18next hook'u

const links = [
  { to: "/organizasyonlar", text: "organizations" },
  { to: "/basarilarimiz", text: "achievements" },
  { to: "/sporcularimiz", text: "athletes" },
  { to: "/antrenorlerimiz", text: "coaches" },
  { to: "/milli_sporcularimiz", text: "national_athletes" },
  { to: "/tarihce", text: "history" },
  { to: "/haberler", text: "news" },
  { to: "/sosyal", text: "social" },
];

const CustomNavbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null); // Dil menüsü için state
  const smallDevice = useMediaQuery("(max-width:1280px)");
  const open = Boolean(anchorEl);
  const languageMenuOpen = Boolean(languageMenuAnchor);

  const { t, i18n } = useTranslation(); // useTranslation hook'u

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    toast.success("Çıkış Başarılı");
  };

  const handleLanguageMenuOpen = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchor(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Dili değiştir
    handleLanguageMenuClose(); // Menü kapat
  };

  return (
    <AppBar position="static" className="bg-kagit-900 shadow-md">
      <Container maxWidth="xl">
        <Toolbar
          className={`flex items-center py-4 max-sm:px-2 ${
            smallDevice ? "justify-between" : "justify-center"
          }`}
        >
          <RouterLink to="/" className="flex items-center text-white text-2xl font-semibold">
            <img src={logo} alt="Logo" className="me-2 h-[62px]" />
            <h1 className="w-min">KOCAELİ JUDO</h1>
          </RouterLink>
          <div className="xl:hidden">
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="bg-white text-kagit-900"
            >
              <MenuIcon />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {links
                .filter(
                  (link) =>
                    link.to !== "/sosyal" ||
                    (isAuthenticated && user?.userType !== "turnuvaKayit")
                )
                .map((link, index) => (
                  <MenuItem key={index} onClick={handleClose}>
                    <RouterLink
                      key={index}
                      to={link.to}
                      className={`hover:text-gray-300 transition-colors duration-300 ease-in-out ${
                        link?.to === "/sosyal" ? "font-blueVinyl" : ""
                      }`}
                    >
                      {t(link.text)} {/* Çeviri metni */}
                    </RouterLink>
                  </MenuItem>
                ))}
              <MenuItem>
                {user ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleLogout}
                    className="bg-kagit-900 text-white hover:bg-white hover:text-kagit-900 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                    sx={{ textTransform: "none" }}
                  >
                    {t("logout")}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    className="bg-kagit-900 text-white hover:bg-white hover:text-kagit-900 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                    sx={{ textTransform: "none" }}
                  >
                    <RouterLink to="/login" className="text-reset text-decoration-none">
                      {t("login")}
                    </RouterLink>
                  </Button>
                )}
              </MenuItem>
              <MenuItem>
                <LanguageIcon style={{ marginRight: 8 }} />
                <span
                  style={{ cursor: "pointer", marginRight: 8 }}
                  onClick={() => {
                    changeLanguage("tr");
                    handleClose();
                  }}
                >
                  Türkçe
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    changeLanguage("en");
                    handleClose();
                  }}
                >
                  English
                </span>
              </MenuItem>
            </Menu>
          </div>
          <div className="flex items-center space-x-6 max-xl:hidden ml-6">
            {links
              .filter(
                (link) =>
                  link.to !== "/sosyal" ||
                  (isAuthenticated && user?.userType !== "turnuvaKayit")
              )
              .map((link, index) => (
                <RouterLink
                  key={index}
                  to={link.to}
                  className={`hover:text-gray-300 transition-colors duration-300 ease-in-out shrink-0 ${
                    link?.to === "/sosyal" ? "font-blueVinyl" : ""
                  }`}
                >
                  {t(link.text)} {/* Çeviri metni */}
                </RouterLink>
              ))}
            {user ? (
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleLogout}
                className="text-white shrink-0 hover:bg-white hover:text-kagit-900 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                sx={{ textTransform: "none" }}
              >
                {t("logout")}
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                className="text-white shrink-0 hover:bg-white hover:text-kagit-900 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                sx={{ textTransform: "none" }}
              >
                <RouterLink to="/login" className="text-reset text-decoration-none">
                  {t("login")}
                </RouterLink>
              </Button>
            )}
            {/* Dil değiştirme açılır menüsü */}
            <IconButton
              color="inherit"
              onClick={handleLanguageMenuOpen}
              className="text-white"
            >
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={languageMenuAnchor}
              open={languageMenuOpen}
              onClose={handleLanguageMenuClose}
            >
              <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
              <MenuItem onClick={() => changeLanguage("tr")}>Türkçe</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default CustomNavbar;
