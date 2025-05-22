import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-hot-toast";
import { categories, competitions, places } from "../utils/constants";
import { AchievementModal } from "../components/Modals/AchievementModal";
import formatDate from "../utils/formatDate";
import { allWeights } from "../utils/constants";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next";
import "../styles/Basarilarimiz.css";

export default function Basarilarimiz() {
  const user = useSelector((state) => state.user.user);

  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [filters, setFilters] = useState({
    competition: "",
    place: "",
    category: "",
    athlete: "",
    date: "",
    location: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState(null);
  const [locations, setLocations] = useState([]);

  const tableRef = useRef();

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await axios.get("/achievements/filters");
      setLocations(response.data.data.locations); // Yerleri state'e ata
    } catch (error) {
      toast.error("Filtreleme seçenekleri yüklenirken bir hata oluştu.");
    }
  }, []);

  // Modal açma ve kapama işlevleri
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Form alanları değişikliklerini izleme
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Başarıları sunucudan çekme işlevi
  const fetchAchievements = useCallback(async () => {
    try {
      const response = await axios.get("/achievements", { params: filters });
      setAchievements(response.data.data);
    } catch (error) {
      toast.error("Başarılar yüklenirken bir hata oluştu.");
    }
  }, [filters]);

  // Bileşen yüklendiğinde başarıları çek
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Başarı eklendiğinde veriyi güncelleme
  const handleAchievementAdded = () => {
    fetchAchievements();
    toast.success("Başarı ekleme işlemi başarılı!");
    handleClose();
  };

  // Silme onay diyaloğunu açma
  const openDeleteDialog = (achievementId) => {
    setAchievementToDelete(achievementId);
    setDeleteDialogOpen(true);
  };

  // Silme onay diyaloğunu kapatma
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAchievementToDelete(null);
  };

  // Başarıyı silme işlevi
  const handleDeleteAchievement = async () => {
    try {
      await axios.delete(`/achievements/${achievementToDelete}`);
      toast.success("Başarı başarıyla silindi");
      closeDeleteDialog();
      fetchAchievements(); // Silme işleminden sonra başarıları yeniden yükle
    } catch (error) {
      toast.error(error.response.data.message || "Başarı silinirken bir hata oluştu");
    }
  };

  useEffect(() => {
    fetchFilterOptions(); // Bileşen yüklendiğinde filtreleme seçeneklerini çek
  }, [fetchFilterOptions]);

  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: "Başarılarımız",
  });

  return (
    <div className="flex justify-center py-6 bg-gray-50">
      <div className="w-full lg:w-3/4 max-w-screen-2xl bg-white shadow-md rounded-lg p-6">
        <form id="liste_form" name="liste_form" className="space-y-6">
          <div className="text-center">
            <h3 className="font-poppins text-3xl font-bold text-gray-800">
              {t("achievements")}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <FormControl className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12">
              <InputLabel id="select-sampiyona-label">{t("competition")}</InputLabel>
              <Select
                id="td"
                name="competition"
                label="Turnuva"
                value={filters.competition}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                {competitions.map((competition, index) => (
                  <MenuItem key={index} value={competition}>
                    {competition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12">
              <InputLabel id="select-derece-label">{t("place")}</InputLabel>
              <Select
                id="dc"
                name="place"
                label="Derece"
                value={filters.place}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                {places.map((place) => (
                  <MenuItem key={place} value={place}>
                    {place}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12">
              <InputLabel id="select-kategori-label">{t("category")}</InputLabel>
              <Select
                id="kd"
                name="category"
                label="Kategori"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12">
              <InputLabel id="select-siklet-label">{t("weight")}</InputLabel>
              <Select
                id="weight"
                name="weight"
                label="Siklet"
                value={filters.allWeights}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                {allWeights.map((weight, index) => (
                  <MenuItem key={index} value={weight}>
                    {weight}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12">
              <InputLabel id="select-location-label">{t("location")}</InputLabel>
              <Select
                id="location"
                name="location"
                label="Yer"
                value={filters.location}
                onChange={handleFilterChange}
              >
                <MenuItem value="">{t("all")}</MenuItem>
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12"
              id="ad"
              name="athlete"
              label={t("athlete")}
              inputProps={{ maxLength: 50 }}
              variant="outlined"
              value={filters.athlete}
              onChange={handleFilterChange}
            />

            <TextField
              className="w-full lg:w-1/7 md:w-1/4 sm:w-5/12"
              id="tt"
              name="date"
              label={t("date")}
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={filters.date}
              onChange={handleFilterChange}
            />

            {user?.userType === "admin" && (
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Başarı Ekle
              </Button>
            )}
          </div>
        </form>

        <div className="text-right mb-4 max-sm:mt-4">
          <Button variant="contained" color="primary" onClick={handlePrint}>
            {t("print_pdf")}
          </Button>
        </div>

        <div className="overflow-x-auto" ref={tableRef}>
          <table className="w-full print:w-auto mt-6 table-auto border-collapse text-left">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border-b">{t("competition")}</th>
                <th className="p-2 border-b">{t("place")}</th>
                <th className="p-2 border-b">{t("athlete")}</th>
                <th className="p-2 border-b">{t("category")}</th>
                <th className="p-2 border-b">{t("weight")}</th>
                <th className="p-2 border-b">{t("location")}</th>
                <th className="p-2 border-b">{t("date")}</th>
                {user?.userType === "admin" && (
                  <th className="p-2 border-b islemler">İşlemler</th>
                )}
              </tr>
            </thead>
            <tbody>
              {achievements.map((achievement) => (
                <tr key={achievement._id}>
                  <td className="p-2 border-b">{achievement.competition}</td>
                  <td className="p-2 border-b">{achievement.place}</td>
                  <td className="p-2 border-b">{achievement.athlete}</td>
                  <td className="p-2 border-b">{achievement.category}</td>
                  <td className="p-2 border-b">{achievement.weight}</td>
                  <td className="p-2 border-b">{achievement.location}</td>
                  <td className="p-2 border-b">{formatDate(achievement.date)}</td>
                  {user?.userType === "admin" && (
                    <td className="p-2 border-b islemler">
                      <IconButton
                        color="error"
                        onClick={() => openDeleteDialog(achievement._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AchievementModal
        open={open}
        handleClose={handleClose}
        onAchievementAdded={handleAchievementAdded}
      />

      {/* Silme Onay Diyaloğu */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Başarıyı silmek istediğinize emin misiniz?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            İptal
          </Button>
          <Button onClick={handleDeleteAchievement} color="error" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
