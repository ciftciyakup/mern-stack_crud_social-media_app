import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_TOURNAMENT_FILE_URL } from "../utils/constants";
import TurnuvaModal from "../components/Modals/TurnuvaModal";
import { TurnuvaKayitModal } from "../components/Modals/TurnuvaKayitModal";
import { Button } from "@mui/material";
import { Edit, Delete, PersonAdd } from "@mui/icons-material";
import { showDeleteConfirmation } from "../components/Layouts/DeleteConfirmation";
import toast from "react-hot-toast";
import formatDate from "../utils/formatDate";
import { useSelector } from "react-redux";
import AthleteList from "../components/Organizasyon/AthleteList";
import { useTranslation } from "react-i18next"; // Çoklu dil desteği için ekleme

const Organizasyon = () => {
  const { t, i18n } = useTranslation(); // useTranslation hook'u
  const athleteListRef = useRef();

  const { user } = useSelector((state) => state.user);

  const { organizasyon } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);

  const fetchTournament = async () => {
    try {
      const response = await axios.get(`/tournaments/${organizasyon}`);
      setTournament(response.data);
    } catch (error) {
      console.error(t("tournament_fetch_error"), error); // Çoklu dil desteği
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament(); // eslint-disable-next-line
  }, [organizasyon]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleUpdateTournament = (updatedTournament) => {
    setTournament(updatedTournament);
  };

  const handleDeleteTournament = async () => {
    showDeleteConfirmation({
      message: "Bu turnuvayı silmek istediğinizden emin misiniz?",
      onConfirm: async () => {
        try {
          await axios.delete(`/tournaments/${tournament._id}`);
          toast.success("Turnuva başarıyla silindi.");
          navigate("/organizasyonlar");
        } catch (error) {
          console.error("Turnuva silinirken bir hata oluştu:", error);
          toast.error("Turnuva silinemedi.");
        }
      },
    });
  };

  const handleRegistrationModalOpen = () => {
    setRegistrationModalOpen(true);
  };

  const handleRegistrationModalClose = () => {
    setRegistrationModalOpen(false);
  };

  const handleRegistrationAdded = () => {
    toast.success(t("registration_success")); // Çoklu dil desteği
    athleteListRef.current?.fetchAthletes(); // Sporcuları yeniden yükle
  };

  if (loading) {
    return <div className="text-center py-6">{t("loading")}</div>; // Çoklu dil desteği
  }

  if (!tournament) {
    return <div className="text-center py-6">{t("tournament_not_found")}</div>; // Çoklu dil desteği
  }

  return (
    <div className="flex flex-col items-center py-10 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100">
      <div className="w-full lg:w-3/4 max-w-screen-2xl bg-white shadow-2xl rounded-lg overflow-hidden relative">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <img
              src={BASE_TOURNAMENT_FILE_URL + tournament.photo}
              alt={tournament.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
            <div className="flex justify-center flex-wrap space-x-2 mb-4">
              {user?.userType === "admin" && (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  color="primary"
                  onClick={handleModalOpen}
                  className="mb-2"
                >
                  Düzenle
                </Button>
              )}

              {user?.userType === "admin" && (
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  color="secondary"
                  onClick={handleDeleteTournament}
                  className="mb-2"
                >
                  Sil
                </Button>
              )}

              {(user?.userType === "admin" || user?.userType === "turnuvaKayit") &&
                !tournament.isCompleted && (
                  <Button
                    variant="outlined"
                    startIcon={<PersonAdd />}
                    color="success"
                    onClick={handleRegistrationModalOpen}
                    className="mb-2"
                  >
                    {t("register_tournament")} {/* Çoklu dil desteği */}
                  </Button>
                )}
            </div>

            {tournament.video && (
              <div className="mb-6 mx-auto">
                <video controls className="max-h-[500px] rounded-lg shadow-md">
                  <source src={BASE_TOURNAMENT_FILE_URL + tournament.video} type="video/mp4" />
                  {t("video_not_supported")} {/* Çoklu dil desteği */}
                </video>
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{tournament.name}</h2>
            <p className="text-lg text-gray-600 mb-4">
              <strong>{t("start_date")}:</strong>{" "}
              {formatDate(tournament.startDate, i18n.language)}
            </p>
            <p className="text-lg text-gray-600 mb-4">
              <strong>{t("end_date")}:</strong> {formatDate(tournament.endDate, i18n.language)}
            </p>
            <ul className="space-y-4">
              {tournament.photoArchiveUrl && (
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={tournament.photoArchiveUrl}
                    className="text-lg text-blue-600 hover:text-blue-800 transition duration-300"
                  >
                    📸 {t("photo_archive")} {/* Çoklu dil desteği */}
                  </Link>
                </li>
              )}
              {tournament.regulationUrl && (
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={BASE_TOURNAMENT_FILE_URL + tournament.regulationUrl}
                    className="text-lg text-blue-600 hover:text-blue-800 transition duration-300"
                  >
                    📜 {t("regulation")} {/* Çoklu dil desteği */}
                  </Link>
                </li>
              )}
              {tournament.top7Url && (
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={BASE_TOURNAMENT_FILE_URL + tournament.top7Url}
                    className="text-lg text-blue-600 hover:text-blue-800 transition duration-300"
                  >
                    🏅 {t("top_7")} {/* Çoklu dil desteği */}
                  </Link>
                </li>
              )}
              {tournament.resultsUrl && (
                <li>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    to={BASE_TOURNAMENT_FILE_URL + tournament.resultsUrl}
                    className="text-lg text-blue-600 hover:text-blue-800 transition duration-300"
                  >
                    🥋 {t("results")} {/* Çoklu dil desteği */}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4 max-w-screen-2xl mt-10">
        <h3 className="text-xl font-bold mb-4">{t("registered_athletes")}</h3>{" "}
        {/* Çoklu dil desteği */}
        <AthleteList ref={athleteListRef} tournamentId={tournament._id} />
      </div>

      <TurnuvaModal
        open={isModalOpen}
        onClose={handleModalClose}
        mode="edit"
        initialData={tournament}
        onSubmit={handleUpdateTournament}
      />

      <TurnuvaKayitModal
        open={isRegistrationModalOpen}
        handleClose={handleRegistrationModalClose}
        onRegistrationAdded={handleRegistrationAdded}
        tournamentId={tournament._id}
      />
    </div>
  );
};

export default Organizasyon;
