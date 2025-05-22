import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Select from "react-select";
import countryList from "react-select-country-list";
import UserList from "./UserList"; // Yeni bileşeni içe aktar
import { showDeleteConfirmation } from "../../Layouts/DeleteConfirmation";

const CreateUser = () => {
  const [userType, setUserType] = useState("guest");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState({ value: "TR", label: "Türkiye" });
  const [city, setCity] = useState("");
  const [club, setClub] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // Kullanıcıları tutmak için state

  const countries = countryList().getData(); // Ülkeler listesi

  // Kullanıcıları listeleme
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/list-users", {
        params: { userType },
      });
      setUsers(data.users); // Kullanıcıları güncelle
    } catch (err) {
      if (err.response?.status === 404) {
        setUsers([]); // Kullanıcı yoksa listeyi boş bir dizi yap
        toast.error("Hiç kullanıcı bulunamadı.");
      } else {
        toast.error(
          err.response?.data?.message || "Kullanıcılar listelenirken bir hata oluştu."
        );
      }
    }
  };

  // Kullanıcı türü değiştiğinde kullanıcıları listele
  useEffect(() => {
    fetchUsers();
  }, [userType]);

  // Kullanıcı silme işlemi
  const handleDeleteUser = async (id) => {
    showDeleteConfirmation({
      message: "Bu kullanıcıyı silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          await axios.delete(`/userdetails/${id}`);
          toast.success("Kullanıcı başarıyla silindi.");
          fetchUsers(); // Kullanıcı listesini yeniden yükle
        } catch (err) {
          toast.error(err.response?.data?.message || "Kullanıcı silinirken bir hata oluştu.");
        }
      },
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Parola doğrulama
    if (password !== confirmPassword) {
      toast.error("Parolalar eşleşmiyor.");
      return;
    }

    // Form doğrulama
    if (!fullname || !username || !phoneNumber || !password) {
      toast.error("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    // Kullanıcı verilerini hazırlama
    const userData = {
      userType,
      fullname,
      username,
      phoneNumber,
      password,
      ...(userType === "turnuvaKayit" && {
        country: country.label,
        city,
        club,
      }),
    };

    try {
      setLoading(true);
      await axios.post("/create-user", userData);
      toast.success("Kullanıcı başarıyla oluşturuldu.");
      // Formu sıfırla
      setFullname("");
      setUsername("");
      setPhoneNumber("");
      setPassword("");
      setConfirmPassword("");
      setCountry({ value: "TR", label: "Türkiye" });
      setCity("");
      setClub("");
      fetchUsers(); // Kullanıcıları yeniden yükle
    } catch (err) {
      toast.error(err.response?.data?.message || "Kullanıcı oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Kullanıcı Oluştur</h1>
      <form onSubmit={handleCreateUser} className="flex flex-col gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Kullanıcı Türü</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="guest">Misafir</option>
            <option value="turnuvaKayit">Turnuva Kayıt</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Ad Soyad</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ad Soyad"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Kullanıcı Adı"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Telefon Numarası</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Telefon Numarası"
          />
        </div>
        {userType === "turnuvaKayit" && (
          <>
            <div>
              <label className="block font-medium mb-1">Ülke</label>
              <Select
                options={countries}
                value={country}
                onChange={setCountry}
                className="w-full"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Şehir</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Şehir"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Kulüp</label>
              <input
                type="text"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="Kulüp"
              />
            </div>
          </>
        )}
        <div>
          <label className="block font-medium mb-1">Parola</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Parola"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Parola (Tekrar)</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Parola (Tekrar)"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white font-medium rounded py-2 px-4"
        >
          {loading ? "Oluşturuluyor..." : "Oluştur"}
        </button>
      </form>

      {/* Kullanıcıları Listeleme */}
      <UserList users={users} onDelete={handleDeleteUser} userType={userType} />
    </div>
  );
};

export default CreateUser;
