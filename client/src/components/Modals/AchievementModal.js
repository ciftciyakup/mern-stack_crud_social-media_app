import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-hot-toast";
import axios from "axios";
import { allWeights, categories, competitions, places } from "../../utils/constants";

export function AchievementModal({ open, handleClose, onAchievementAdded }) {
  const [formData, setFormData] = useState({
    competition: "",
    place: "",
    category: "",
    athlete: "",
    location: "",
    date: "",
  });

  // Form verilerini güncelleme
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form gönderme işlemi
  const handleSubmit = async () => {
    // Tüm alanların doldurulduğunu doğrula
    const { competition, place, category, athlete, location, date } = formData;
    if (!competition || !place || !category || !athlete || !location || !date) {
      toast.error("Lütfen tüm alanları doldurunuz.");
      return;
    }

    try {
      // Sunucuya başarı ekleme isteği gönder
      const response = await axios.post("/achievements", formData);

      if (response.data.success) {
        toast.success("Başarı ekleme işlemi başarılı!");
        onAchievementAdded(); // Başarı eklendikten sonra tabloyu güncelle
        handleClose(); // Modalı kapat
      }
    } catch (error) {
      toast.error("Başarı ekleme işlemi başarısız!");
      console.error("Ekleme hatası:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Başarı Ekle</DialogTitle>
      <DialogContent>
        <form className="space-y-4">
          <FormControl fullWidth>
            <InputLabel>Turnuva</InputLabel>
            <Select
              label="Turnuva"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
            >
              {competitions.map((competition, index) => (
                <MenuItem key={index} value={competition}>
                  {competition}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Derece</InputLabel>
            <Select label="Derece" name="place" value={formData.place} onChange={handleChange}>
              {places.map((place) => (
                <MenuItem key={place} value={place}>
                  {place}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Kategori</InputLabel>
            <Select
              label="Kategori"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Siklet</InputLabel>
            <Select name="weight" value={formData.weight} onChange={handleChange}>
              {allWeights.map((weight, index) => (
                <MenuItem key={index} value={weight}>
                  {weight}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Sporcu"
            name="athlete"
            value={formData.athlete}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            label="Yer"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            inputProps={{ maxLength: 50 }}
          />

          <TextField
            label="Tarih"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          İptal
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Ekle
        </Button>
      </DialogActions>
    </Dialog>
  );
}
