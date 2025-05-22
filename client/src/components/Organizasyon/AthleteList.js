import axios from "axios";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { allWeights, categories, weights } from "../../utils/constants";
import { showDeleteConfirmation } from "../Layouts/DeleteConfirmation";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next"; // Çoklu dil desteği için ekleme
import "../../styles/AthleteList.css";

const categoryToWeightKey = {
  Minikler: "U13",
  Yıldızlar: "U15",
  Ümitler: "U18",
  Gençler: "U21",
  U23: "U21",
  Büyükler: "Seniors",
  Veteranlar: "Seniors",
};

const AthleteList = forwardRef(({ tournamentId }, ref) => {
  const { t } = useTranslation(); // useTranslation hook'u
  const { user } = useSelector((state) => state.user);

  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    weightClass: "",
    country: "",
    city: "",
    club: "",
    coach: user?.userType === "turnuvaKayit" ? user?._id : "", // Eğer userType turnuvaKayit ise coach otomatik atanır
  });
  const [availableWeights, setAvailableWeights] = useState(allWeights);
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    cities: [],
    clubs: [],
    coaches: [],
  });

  const tableRef = useRef(); // Tabloyu referans almak için useRef kullanıyoruz

  // Yazdırma işlevi
  const handlePrint = useReactToPrint({
    contentRef: tableRef,
    documentTitle: t("athlete_list"), // Çoklu dil desteği
  });

  // Filtreleme seçeneklerini backend'den al
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("/athletes/filters");
      setFilterOptions(response.data);
    } catch (error) {
      console.error(t("filter_error"), error); // Çoklu dil desteği
      toast.error(t("filter_error")); // Çoklu dil desteği
    }
  };

  // Sporcuları getir
  const fetchAthletes = async () => {
    try {
      const response = await axios.get("/athletes", { params: { ...filters, tournamentId } });
      setAthletes(response.data);
    } catch (error) {
      console.error(t("athletes_fetch_error"), error); // Çoklu dil desteği
      toast.error(t("athletes_fetch_error")); // Çoklu dil desteği
    } finally {
      setLoading(false);
    }
  };

  // `fetchAthletes` fonksiyonunu dışarıya aç
  useImperativeHandle(ref, () => ({
    fetchAthletes,
  }));

  // Sporcuyu sil
  const handleDeleteAthlete = async (athleteId) => {
    try {
      await axios.delete(`/athletes/${athleteId}`);
      toast.success(t("delete_success")); // Çoklu dil desteği
      fetchAthletes(); // Listeyi güncelle
    } catch (error) {
      console.error(t("delete_error"), error); // Çoklu dil desteği
      toast.error(t("delete_error")); // Çoklu dil desteği
    }
  };

  // Silme işlemi için onay penceresi
  const confirmDeleteAthlete = (athleteId) => {
    showDeleteConfirmation({
      message: t("delete_confirmation"), // Çoklu dil desteği
      onConfirm: () => handleDeleteAthlete(athleteId),
    });
  };

  // Filtreleme işlemi
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Eğer kategori değişirse, sikletleri güncelle
    if (name === "category") {
      updateAvailableWeights(value, filters.gender);
    }
    // Eğer cinsiyet değişirse, sikletleri güncelle
    else if (name === "gender") {
      updateAvailableWeights(filters.category, value);
    }
  };

  // Kategori ve cinsiyete göre siklet listesini güncelle
  const updateAvailableWeights = (category, gender) => {
    if (!category || !gender) {
      setAvailableWeights(allWeights); // Eğer kategori veya cinsiyet seçilmemişse tüm sikletleri göster
      return;
    }

    const weightKey = categoryToWeightKey[category];
    if (weightKey && weights[weightKey]) {
      const genderKey = gender === t("male") ? "Male" : "Female";
      const weightOptions = weights[weightKey][genderKey] || [];
      setAvailableWeights(weightOptions);

      // Eğer önceki siklet yeni listede yoksa, siklet seçimini sıfırla
      if (filters.weightClass && !weightOptions.includes(filters.weightClass)) {
        setFilters((prev) => ({ ...prev, weightClass: "" }));
      }
    } else {
      setAvailableWeights(allWeights); // Eğer uygun bir kategori bulunamazsa tüm sikletleri göster
    }
  };

  useEffect(() => {
    fetchFilterOptions(); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tournamentId) {
      fetchAthletes();
    } // eslint-disable-next-line
  }, [tournamentId, filters]);

  useEffect(() => {
    if (filters.category && filters.gender) {
      updateAvailableWeights(filters.category, filters.gender);
    } else {
      setAvailableWeights(allWeights); // Varsayılan olarak tüm sikletleri göster
    } // eslint-disable-next-line
  }, [filters.category, filters.gender]);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Filtreleme Başlığı */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("athlete_filtering")}</h2>{" "}
      {/* Çoklu dil desteği */}
      {/* Filtreleme Seçenekleri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: t("category"), name: "category", options: categories },
          { label: t("gender"), name: "gender", options: [t("male"), t("female")] },
          { label: t("weight"), name: "weightClass", options: availableWeights },
          { label: t("country"), name: "country", options: filterOptions.countries },
          { label: t("city"), name: "city", options: filterOptions.cities },
          { label: t("club"), name: "club", options: filterOptions.clubs },
        ].map((filter, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">{filter.label}</label>
            <select
              name={filter.name}
              value={filters[filter.name]}
              onChange={handleFilterChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">{t("all")}</option> {/* Çoklu dil desteği */}
              {filter.options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Antrenör */}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("coach")}</label>
          <select
            name="coach"
            value={filters.coach}
            onChange={handleFilterChange}
            disabled={user?.userType === "turnuvaKayit"} // Eğer userType turnuvaKayit ise select devre dışı bırakılır
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">{t("all")}</option>
            {filterOptions.coaches.map((coach, idx) => (
              <option key={idx} value={coach.id}>
                {coach.fullname}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Yazdırma Butonu */}
      <div className="text-right mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("print_pdf")} {/* Çoklu dil desteği */}
        </button>
      </div>
      {/* Sporcu Tablosu */}
      {loading ? (
        <div className="text-center py-4 text-gray-600">{t("loading")}</div>
      ) : athletes.length === 0 ? (
        <div className="text-center py-4 text-gray-600">{t("no_athletes_found")}</div>
      ) : (
        <div className="table-container" ref={tableRef}>
          <table className="w-full print:w-auto divide-y divide-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {[
                  t("first_name"),
                  t("last_name"),
                  t("category"),
                  t("weight"),
                  t("gender"),
                  t("country"),
                  t("city"),
                  t("club"),
                  t("coach"),
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
                {(user?.userType === "turnuvaKayit" || user?.userType === "admin") && (
                  <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider islemler">
                    {t("actions")} {/* Çoklu dil desteği */}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {athletes.map((athlete, index) => (
                <tr key={athlete._id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.firstName}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.lastName}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.category}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.weightClass}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {t(athlete.gender.toLowerCase())} {/* Çoklu dil desteği */}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.country || t("not_specified")} {/* Çoklu dil desteği */}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.city || t("not_specified")} {/* Çoklu dil desteği */}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.club || t("not_specified")} {/* Çoklu dil desteği */}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {athlete.coachId?.fullname || t("not_specified")} {/* Çoklu dil desteği */}
                  </td>
                  {(user?.userType === "admin" || user?._id === athlete.coachId?._id) && (
                    <td className="p-2 whitespace-nowrap text-sm text-gray-900 islemler">
                      <button
                        onClick={() => confirmDeleteAthlete(athlete._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t("delete")} {/* Çoklu dil desteği */}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default AthleteList;
