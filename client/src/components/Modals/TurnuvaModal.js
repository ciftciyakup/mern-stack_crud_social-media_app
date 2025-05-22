import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "react-hot-toast";
import axios from "axios";

const TurnuvaModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isCompleted: false,
  });

  const [files, setFiles] = useState({
    photo: null,
    regulation: null,
    top7: null,
    results: null,
  });

  // Tarih formatını YYYY-MM-DD formatına dönüştür
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Güncelleme modunda başlangıç verilerini yükle
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        name: initialData.name || "",
        startDate: formatDate(initialData.startDate), // Tarihi formatla
        endDate: formatDate(initialData.endDate), // Tarihi formatla
        isCompleted: initialData.isCompleted || false,
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, isCompleted: e.target.checked });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prevFiles) => ({
      ...prevFiles,
      [name]: selectedFiles[0], // Sadece değişen dosyayı güncelle
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    data.append("isCompleted", formData.isCompleted);

    // Tüm dosyaları FormData'ya ekle
    if (files.photo) data.append("photo", files.photo);
    if (files.video) data.append("video", files.video);
    if (files.regulation) data.append("regulation", files.regulation);
    if (files.top7) data.append("top7", files.top7);
    if (files.results) data.append("results", files.results);

    try {
      if (mode === "add") {
        // Turnuva ekleme işlemi
        const response = await axios.post("/tournaments", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Turnuva başarıyla eklendi!");
        onSubmit(response.data); // Yeni turnuvayı listeye eklemek için callback
      } else if (mode === "edit") {
        // Turnuva güncelleme işlemi
        const response = await axios.put(`/tournaments/${initialData._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Turnuva başarıyla güncellendi!");
        onSubmit(response.data); // Güncellenen turnuvayı listeye eklemek için callback
      }
      onClose(); // Modalı kapat
    } catch (error) {
      toast.error(error.response?.data?.error || "İşlem sırasında bir hata oluştu.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "add" ? "Yeni Turnuva Ekle" : "Turnuvayı Güncelle"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Turnuva Adı"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Başlangıç Tarihi"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Bitiş Tarihi"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isCompleted}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Tamamlandı"
          />
          <div>
            <label className="block font-medium mb-1">Fotoğraf</label>
            <input type="file" name="photo" onChange={handleFileChange} accept="image/*" />
          </div>
          <div>
            <label className="block font-medium mb-1">Video</label>
            <input type="file" name="video" onChange={handleFileChange} accept="video/*" />
          </div>
          <div>
            <label className="block font-medium mb-1">Regleman</label>
            <input type="file" name="regulation" onChange={handleFileChange} accept=".pdf" />
          </div>
          <div>
            <label className="block font-medium mb-1">İlk 7</label>
            <input type="file" name="top7" onChange={handleFileChange} accept=".pdf" />
          </div>
          <div>
            <label className="block font-medium mb-1">Sonuçlar</label>
            <input type="file" name="results" onChange={handleFileChange} accept=".pdf" />
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          İptal
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {mode === "add" ? "Ekle" : "Güncelle"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TurnuvaModal;
