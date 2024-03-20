import React, { useEffect, useState } from "react";
import { Container, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../slices/userSlice";

const Dogrulama = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [remainingTime, setRemainingTime] = useState(10); // Başlangıçta 10 saniye olarak ayarlandı

  useEffect(() => {
    // Belli bir süre sonra otomatik çıkış ve ana sayfaya yönlendirme için bir zamanlayıcı oluşturun
    const logoutTimer = setTimeout(() => {
      dispatch(logoutUser());
      navigate("/");
    }, remainingTime * 1000); // remainingTime değeri milisaniyeye dönüştürüldü

    // Komponent kaldırıldığında zamanlayıcıyı temizleyin (bellek sızıntısı önlemek için)
    return () => clearTimeout(logoutTimer);
  }, [navigate, dispatch, remainingTime]);

  // remainingTime değişkenini her saniye güncelleyecek bir zamanlayıcı başlatma
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000); // Her saniye (1000 milisaniye * 1)

    // Komponent kaldırıldığında zamanlayıcıyı temizleyin (bellek sızıntısı önlemek için)
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      // Geri tuşuna tepki verme ve kullanıcıyı sayfada tutma
      window.history.forward();
    };

    // window.onpopstate olayını dinleme
    window.addEventListener("popstate", handlePopState);

    return () => {
      // Komponent kaldırıldığında olay dinleyicisini kaldırma
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      // Uyarı mesajı gösterme
      event.returnValue = "Sayfadan ayrılmak istediğinize emin misiniz?";
    };

    // window.onbeforeunload olayını dinleme
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      // Komponent kaldırıldığında olay dinleyicisini kaldırma
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Container className="mt-4">
      <Alert severity="warning">
        Hesabınız henüz onaylanmamıştır. Hesabınızın yönetici (Galip Şentürk)
        tarafından onaylanmasını talep edin. {remainingTime} içerisinde otomatik
        çıkış yapılacaktır.
      </Alert>
    </Container>
  );
};

export default Dogrulama;
