import Athlete from "../models/athleteModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";

// Tüm sporcuları getir (filtreleme destekli)
export const getAthletes = catchAsync(async (req, res, next) => {
  const { category, gender, weightClass, country, city, club, tournamentId, coach } =
    req.query;

  const filters = {};
  if (category) filters.category = category;
  if (gender) filters.gender = gender;
  if (weightClass) filters.weightClass = weightClass;
  if (country) filters.country = country;
  if (city) filters.city = city;
  if (club) filters.club = club;
  if (tournamentId) filters.tournamentId = tournamentId;
  if (coach) filters.coachId = coach;

  const athletes = await Athlete.find(filters).populate("tournamentId").populate("coachId");
  res.status(200).json(athletes);
});

// Aynı anda birden fazla sporcu ekle
export const bulkCreateAthletes = catchAsync(async (req, res, next) => {
  const { athletes } = req.body;
  const { country, city, club, _id: coachId } = req.user;

  if (!athletes || !Array.isArray(athletes) || athletes.length === 0) {
    return next(new ErrorHandler("En az bir sporcu bilgisi gönderilmelidir.", 400));
  }

  const createdAthletes = [];

  for (const athleteData of athletes) {
    const { firstName, lastName, birthDate, gender, category, weightClass, tournamentId } =
      athleteData;

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !gender ||
      !category ||
      !weightClass ||
      !tournamentId
    ) {
      return next(new ErrorHandler("Tüm sporcu bilgileri eksiksiz doldurulmalıdır.", 400));
    }

    const newAthlete = new Athlete({
      firstName,
      lastName,
      birthDate,
      gender,
      category,
      weightClass,
      tournamentId,
      country,
      city,
      club,
      coachId,
    });

    const savedAthlete = await newAthlete.save();
    createdAthletes.push(savedAthlete);
  }

  res.status(201).json({
    success: true,
    message: `${createdAthletes.length} sporcu başarıyla eklendi.`,
    athletes: createdAthletes,
  });
});

// Benzersiz filtreleme değerlerini getir
export const getFilterOptions = catchAsync(async (req, res, next) => {
  const countries = await Athlete.distinct("country");
  const cities = await Athlete.distinct("city");
  const clubs = await Athlete.distinct("club");

  const coaches = await Athlete.find()
    .distinct("coachId")
    .then((coachIds) =>
      Promise.all(
        coachIds.map(async (id) => {
          const coach = await User.findById(id);
          return coach ? { id: coach._id, fullname: coach.fullname } : null;
        })
      )
    );

  res.status(200).json({
    countries,
    cities,
    clubs,
    coaches: coaches.filter((coach) => coach !== null),
  });
});

// Belirli bir sporcuyu getir
export const getAthleteById = catchAsync(async (req, res, next) => {
  const athlete = await Athlete.findById(req.params.id).populate("tournamentId");
  if (!athlete) {
    return next(new ErrorHandler("Sporcu bulunamadı.", 404));
  }
  res.status(200).json(athlete);
});

// Yeni bir sporcu oluştur
export const createAthlete = catchAsync(async (req, res, next) => {
  const { firstName, lastName, birthDate, gender, category, weightClass, tournamentId } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !birthDate ||
    !gender ||
    !category ||
    !weightClass ||
    !tournamentId
  ) {
    return next(new ErrorHandler("Tüm alanlar gereklidir.", 400));
  }

  const { country, city, club, _id: coachId } = req.user;

  const newAthlete = new Athlete({
    firstName,
    lastName,
    birthDate,
    gender,
    category,
    weightClass,
    tournamentId,
    country,
    city,
    club,
    coachId,
  });

  await newAthlete.save();

  res.status(201).json({
    success: true,
    message: "Sporcu başarıyla oluşturuldu.",
    athlete: newAthlete,
  });
});

// Sporcuyu güncelle
export const updateAthlete = catchAsync(async (req, res, next) => {
  const updatedAthlete = await Athlete.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedAthlete) {
    return next(new ErrorHandler("Sporcu bulunamadı.", 404));
  }
  res.status(200).json(updatedAthlete);
});

// Sporcuyu sil
export const deleteAthlete = catchAsync(async (req, res, next) => {
  const deletedAthlete = await Athlete.findByIdAndDelete(req.params.id);
  if (!deletedAthlete) {
    return next(new ErrorHandler("Sporcu bulunamadı.", 404));
  }
  res.status(200).json({ message: "Sporcu silindi." });
});
