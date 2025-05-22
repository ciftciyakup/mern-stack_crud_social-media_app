import React, { useState, useEffect } from "react";
import { Tabs, Tab, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import TurnuvaModal from "../components/Modals/TurnuvaModal";
import axios from "axios";
import { BASE_TOURNAMENT_FILE_URL } from "../utils/constants";
import { showDeleteConfirmation } from "../components/Layouts/DeleteConfirmation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // Çoklu dil desteği için ekleme

const Organizasyonlar = () => {
  const { t } = useTranslation(); // useTranslation hook'u
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [data, setData] = useState({ current: [], past: [] });
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get("/tournaments");
      const tournaments = response.data;

      const currentDate = new Date();
      const current = tournaments.filter(
        (tournament) => new Date(tournament.endDate) >= currentDate
      );
      const past = tournaments.filter(
        (tournament) => new Date(tournament.endDate) < currentDate
      );

      setData({ current, past });
    } catch (error) {
      console.error("Turnuvalar alınırken bir hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleModalOpen = (mode, tournament = null) => {
    setModalMode(mode);
    setSelectedTournament(tournament);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTournament(null);
  };

  const handleAddOrUpdateTournament = (updatedTournament) => {
    if (modalMode === "add") {
      setData((prevData) => ({
        ...prevData,
        current: [...prevData.current, updatedTournament],
      }));
    } else if (modalMode === "edit") {
      setData((prevData) => {
        const updatedCurrent = prevData.current.map((tournament) =>
          tournament._id === updatedTournament._id ? updatedTournament : tournament
        );
        const updatedPast = prevData.past.map((tournament) =>
          tournament._id === updatedTournament._id ? updatedTournament : tournament
        );
        return { current: updatedCurrent, past: updatedPast };
      });
    }
  };

  const handleDeleteTournament = async (id) => {
    showDeleteConfirmation({
      message: "Bu turnuvayı silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          await axios.delete(`/tournaments/${id}`);
          setData((prevData) => ({
            current: prevData.current.filter((tournament) => tournament._id !== id),
            past: prevData.past.filter((tournament) => tournament._id !== id),
          }));
          toast.success("Turnuva başarıyla silindi.");
        } catch (error) {
          console.error("Turnuva silinirken bir hata oluştu:", error);
          toast.error("Turnuva silinemedi.");
        }
      },
    });
  };

  const renderCards = (items) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Card key={item._id} className="shadow-lg relative">
            <Link to={`/organizasyonlar/${item.url}`}>
              <CardMedia
                component="img"
                height="200"
                image={BASE_TOURNAMENT_FILE_URL + item.photo}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                {user?.userType === "admin" && (
                  <>
                    <Button
                      startIcon={<Edit />}
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        handleModalOpen("edit", item);
                      }}
                      style={{ marginTop: "10px" }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteTournament(item._id);
                      }}
                      style={{ marginTop: "10px", marginLeft: "10px" }}
                    >
                      Sil
                    </Button>
                  </>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-6">{t("loading")}</div>; // Çoklu dil desteği
  }

  return (
    <div className="flex justify-center py-6 bg-gray-50">
      <div className="w-full lg:w-3/4 max-w-screen-2xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={t("past")} /> {/* Çoklu dil desteği */}
            <Tab label={t("current")} /> {/* Çoklu dil desteği */}
          </Tabs>
          {user?.userType === "admin" && (
            <div className="flex space-x-4">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleModalOpen("add")}
              >
                Turnuva Ekle
              </Button>
            </div>
          )}
        </div>
        {activeTab === 0 && renderCards(data.past)}
        {activeTab === 1 && renderCards(data.current)}
      </div>

      <TurnuvaModal
        open={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        initialData={selectedTournament}
        onSubmit={handleAddOrUpdateTournament}
      />
    </div>
  );
};

export default Organizasyonlar;
