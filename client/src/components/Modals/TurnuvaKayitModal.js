import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import { weights } from "../../utils/constants";
import { useTranslation } from "react-i18next"; // Çoklu dil desteği için ekleme

const categoryToWeightKey = {
  "Minikler (U13)": "U13",
  "Yıldızlar (U15 - Hopes)": "U15",
  "Ümitler (U18 - Cadets)": "U18",
  "Gençler (U21 - Juniors)": "U21",
  U23: "U21",
  "Büyükler (Seniors)": "Seniors",
  "Veteranlar (Veterans)": "Seniors",
};

export function TurnuvaKayitModal({ open, handleClose, onRegistrationAdded, tournamentId }) {
  const { t } = useTranslation(); // useTranslation hook'u
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    category: "",
    weightClass: "",
  });

  const [availableWeights, setAvailableWeights] = useState([]);
  const [athletes, setAthletes] = useState([]); // Eklenen sporcuların listesi

  const determineCategory = (birthDate) => {
    if (!birthDate) return "";

    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    if (age <= 12) return "Minikler (U13)";
    if (age <= 14) return "Yıldızlar (U15 - Hopes)";
    if (age <= 17) return "Ümitler (U18 - Cadets)";
    if (age <= 20) return "Gençler (U21 - Juniors)";
    if (age <= 23) return "U23";
    if (age <= 35) return "Büyükler (Seniors)";
    return "Veteranlar (Veterans)";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthDate") {
      const category = determineCategory(value);
      setFormData({ ...formData, birthDate: value, category });
      updateAvailableWeights(category, formData.gender);
    } else if (name === "category" || name === "gender") {
      setFormData({ ...formData, [name]: value });
      if (name === "category") updateAvailableWeights(value, formData.gender);
      if (name === "gender") updateAvailableWeights(formData.category, value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const updateAvailableWeights = (category, gender) => {
    if (!category || !gender) return;

    const weightKey = categoryToWeightKey[category];
    if (weightKey && weights[weightKey]) {
      const genderKey = gender === t("male") ? "Male" : "Female";
      const weightOptions = weights[weightKey][genderKey] || [];
      setAvailableWeights(weightOptions);

      if (formData.weightClass && !weightOptions.includes(formData.weightClass)) {
        setFormData((prev) => ({ ...prev, weightClass: "" }));
      }
    } else {
      setAvailableWeights([]);
    }
  };

  useEffect(() => {
    if (formData.category && formData.gender) {
      updateAvailableWeights(formData.category, formData.gender);
    } // eslint-disable-next-line
  }, []);

  const handleAddAthlete = () => {
    const { firstName, lastName, birthDate, gender, category, weightClass } = formData;

    if (!firstName || !lastName || !birthDate || !gender || !category || !weightClass) {
      toast.error(t("fill_all_fields")); // Çoklu dil desteği
      return;
    }

    setAthletes((prev) => [...prev, formData]);
    setFormData({
      firstName: "",
      lastName: "",
      birthDate: "",
      gender: "",
      category: "",
      weightClass: "",
    });
    setAvailableWeights([]);
  };

  const handleDeleteAthlete = (index) => {
    setAthletes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (athletes.length === 0) {
      toast.error(t("add_at_least_one_athlete")); // Çoklu dil desteği
      return;
    }

    try {
      const transformedAthletes = athletes.map((athlete) => ({
        ...athlete,
        gender:
          athlete.gender === "Male"
            ? "Erkek"
            : athlete.gender === "Female"
            ? "Kadın"
            : athlete.gender,
        tournamentId,
      }));

      const response = await axios.post("/athletes/bulk", {
        athletes: transformedAthletes,
      });

      if (response.data.success) {
        toast.success(t("athletes_saved_successfully")); // Çoklu dil desteği
        onRegistrationAdded();
        setAthletes([]);
        handleClose();
      }
    } catch (error) {
      toast.error(t("athletes_save_failed")); // Çoklu dil desteği
      console.error(t("save_error"), error); // Çoklu dil desteği
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>{t("register_tournament")}</DialogTitle> {/* Çoklu dil desteği */}
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <form className="space-y-4">
              <TextField
                label={t("first_name")} // Çoklu dil desteği
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                margin="normal"
              />

              <TextField
                label={t("last_name")} // Çoklu dil desteği
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputProps={{ maxLength: 50 }}
                margin="normal"
              />

              <TextField
                label={t("birth_date")} // Çoklu dil desteği
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>{t("gender")}</InputLabel> {/* Çoklu dil desteği */}
                <Select
                  label={t("gender")}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  {["male", "female"].map((gender, index) => (
                    <MenuItem key={index} value={t(gender)}>
                      {t(gender)} {/* Çoklu dil desteği */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>{t("category")}</InputLabel> {/* Çoklu dil desteği */}
                <Select
                  label={t("category")}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled
                >
                  <MenuItem value={formData.category}>{formData.category}</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>{t("weight")}</InputLabel> {/* Çoklu dil desteği */}
                <Select
                  label={t("weight")}
                  name="weightClass"
                  value={formData.weightClass}
                  onChange={handleChange}
                  disabled={!availableWeights.length}
                >
                  {availableWeights.map((weightClass, index) => (
                    <MenuItem key={index} value={weightClass}>
                      {weightClass}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="contained" color="primary" fullWidth onClick={handleAddAthlete}>
                {t("add")} {/* Çoklu dil desteği */}
              </Button>
            </form>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              {t("added_athletes")} {/* Çoklu dil desteği */}
            </Typography>
            <List>
              {athletes.map((athlete, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label={t("delete")} // Çoklu dil desteği
                      onClick={() => handleDeleteAthlete(index)}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${athlete.firstName} ${athlete.lastName}`}
                    secondary={`${t("category")}: ${athlete.category}, ${t("weight")}: ${
                      athlete.weightClass
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          {t("cancel")} {/* Çoklu dil desteği */}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={athletes.length === 0}
        >
          {t("save")} {/* Çoklu dil desteği */}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
