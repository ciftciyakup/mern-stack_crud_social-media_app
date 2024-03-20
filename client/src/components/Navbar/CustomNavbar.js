import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Toolbar, Button, Container } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import logo from "../../img/logo.svg";
import { logoutUser } from "../../slices/userSlice";
import { toast } from "react-hot-toast";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

const links = [
  { to: "/organizasyonlar", text: "Organizasyonlar" },
  { to: "/basarilarimiz", text: "Başarılarımız" },
  { to: "/sporcularimiz", text: "Sporcularımız" },
  { to: "/antrenorlerimiz", text: "Antrenörlerimiz" },
  { to: "/milli_sporcularimiz", text: "Milli Sporcularımız" },
  { to: "/tarihce", text: "Tarihçe" },
  { to: "/haberler", text: "Haberler" },
  { to: "/sosyal", text: "Sosyal" },
];

const CustomNavbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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

  return (
    <AppBar position="static" className="bg-kagit-900 shadow-md">
      <Container>
        <Toolbar className="flex justify-between items-center py-4 max-sm:px-2">
          <RouterLink
            to="/"
            className="flex items-center text-white text-2xl font-semibold"
          >
            <img src={logo} alt="Logo" className="me-2 h-[62px]" />
            KOCAELİ JUDO
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
                .filter((link) =>
                  !isAuthenticated ? link.to != "/sosyal" : true
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
                      {link.text}
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
                    Çıkış Yap
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="inherit"
                    className="bg-kagit-900 text-white hover:bg-white hover:text-kagit-900 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                    sx={{ textTransform: "none" }}
                  >
                    <RouterLink
                      to="/login"
                      className="text-reset text-decoration-none"
                    >
                      Giriş Yap
                    </RouterLink>
                  </Button>
                )}
              </MenuItem>
            </Menu>
          </div>
          <div className="flex items-center space-x-6 max-xl:hidden">
            {links
              .filter((link) =>
                !isAuthenticated ? link.to != "/sosyal" : true
              )
              .map((link, index) => (
                <RouterLink
                  key={index}
                  to={link.to}
                  className={`hover:text-gray-300 transition-colors duration-300 ease-in-out shrink-0 ${
                    link?.to === "/sosyal" ? "font-blueVinyl" : ""
                  }`}
                >
                  {link.text}
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
                Çıkış Yap
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                className="text-white shrink-0 hover:bg-white hover:text-kagit-900 transition-colors duration-300 ease-in-out px-4 py-2 rounded-md"
                sx={{ textTransform: "none" }}
              >
                <RouterLink
                  to="/login"
                  className="text-reset text-decoration-none"
                >
                  Giriş Yap
                </RouterLink>
              </Button>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default CustomNavbar;
