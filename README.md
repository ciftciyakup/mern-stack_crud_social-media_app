# Kocaeli Judo Sosyal - MERN Stack Spor Kulübü Web Uygulaması

Kocaeli Judo Kulübü için geliştirilmiş, **MongoDB, Express.js, React.js, TailwindCSS ve Node.js** (MERN Stack) teknolojileriyle oluşturulmuş, mobil uyumlu ve rol tabanlı kullanıcı yönetimine sahip bir spor kulübü sosyal medya ve yönetim platformudur.

## 🚀 Canlı Demo

[Projeyi Görüntüle](https://kocaelijudo.com) 🚀

---

## 🖥️ Kullanılan Teknolojiler

**Frontend:**

![reactjs](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![react-router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![tailwindcss](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![mui](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white)

**Backend:**

![nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![expressjs](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![mongodb](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![jwt](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

**Gerçek Zamanlı İletişim:**

![socketio](https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white)

---

## 🎯 Temel Özellikler

### Kimlik Doğrulama ve Kullanıcı Yönetimi

- Güvenli giriş/kayıt (e-posta doğrulama ile)
- Rol tabanlı kullanıcı yönetimi (admin, antrenör, sporcu, turnuva kayıt, misafir)
- Şifre sıfırlama ve profil güncelleme

### Sosyal Medya Özellikleri

- Gönderi paylaşma, beğenme ve yorum yapma
- Sonsuz kaydırma ile gönderi akışı
- Kullanıcı arama ve takip sistemi
- Gönderi kaydetme ve paylaşma

### Spor Kulübü Yönetimi

- Sporcu ve antrenör profilleri
- Turnuva ve sporcu kayıt modülleri
- Turnuva sonuçları, arşiv ve yönetim paneli

### Canlı Sohbet (Socket.IO)

- Gerçek zamanlı birebir mesajlaşma
- Yazıyor/çevrimiçi durum göstergeleri
- Emoji desteği

### Haber ve Duyuru Yönetimi

- Admin panelinden haber ekleme ve düzenleme
- Kullanıcılar için güncel haber akışı

### Diğer Özellikler

- Çoklu dil desteği (i18n)
- Mobil uyumlu ve PWA desteği
- Modern ve kullanıcı dostu arayüz (TailwindCSS & MUI)

---

## Ekran Görüntüleri

Ana Sayfa:
![home](https://user-images.githubusercontent.com/64949957/159116089-cfc2b4c5-dc7d-4d4b-a0c8-668f89ce5412.png)

<table>
  <tr>
    <td><img src="https://github.com/ciftciyakup/mern-stack_crud_social-media_app/blob/main/project-images/Anasayfa-Slider.PNG" alt="mockup" /></td>
    <td><img src="https://github.com/ciftciyakup/mern-stack_crud_social-media_app/blob/main/project-images/Anasayfa-Slider-Mobil.PNG" alt="mockups" style="height:285px"/></td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/64949957/159116105-15b9425c-1fec-4a52-84ba-cf97eef93891.png" alt="mockup" /></td>
    <td><img src="https://user-images.githubusercontent.com/64949957/159116112-1c7dec3e-0f3a-45a8-83d3-6d6b9ee1d5de.png" alt="mockups" /></td>
  </tr>
  <tr>
    <td><img src="https://user-images.githubusercontent.com/64949957/159116115-46f15626-372d-4349-8ef4-a04a70600dcc.png" alt="mockup" /></td>
    <td><img src="https://user-images.githubusercontent.com/64949957/159116118-ac3d261b-eb50-4a7b-a8e6-cd1a0f5720de.png" alt="mockups" /></td>
  </tr>
</table>

---

## Kurulum

1. **Projeyi klonlayın:**

   ````bash
   git clone https://github.com/kullanici-adi/kocaeli-judo-social.git
   cd kocaeli-judo-social

     2. **Sunucu ve istemci bağımlılıklarını yükleyin:**
     ```bash
     cd server
     npm install
     cd ../client
     npm install
   ````

2. **Gerekli ortam değişkenlerini ayarlayın ve MongoDB bağlantınızı yapılandırın.**

   - `.env` dosyalarını hem `server` hem de `client` klasörlerinde oluşturun.
   - Örnek `.env` içeriği:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

3. **Projeyi başlatın:**

   ```bash
   # Sunucu için
   cd server
   npm start

   # İstemci için
   cd ../client
   npm start
   ```

---

## İletişim

Her türlü soru ve iş birliği için bana ulaşabilirsiniz:

[![linkedin](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/yakup-ciftci)

---

> Bu proje, modern spor kulüpleri için sosyal medya ve yönetim ihtiyaçlarını tek bir platformda buluşturur.  
> Mobil uyumlu, güvenli ve kullanıcı dostu bir deneyim sunar.
