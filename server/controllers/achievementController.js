import Achievement from "../models/achievementModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";

// CREATE - Yeni bir başarı oluştur
export const createAchievement = catchAsync(async (req, res, next) => {
  const { competition, place, category, weight, athlete, location, date } = req.body;

  if (!weight) {
    return next(new ErrorHandler("Siklet alanı gereklidir.", 400));
  }

  const achievement = await Achievement.create({
    competition,
    place,
    athlete,
    category,
    weight,
    location,
    date,
  });

  res.status(201).json({
    success: true,
    message: "Başarı başarıyla oluşturuldu",
    data: achievement,
  });
});

// READ - Tüm başarıları getir
export const getAchievements = catchAsync(async (req, res, next) => {
  const { competition, place, category, weight, athlete, date } = req.query;

  const filter = {};
  if (competition) filter.competition = competition;
  if (place) filter.place = place;
  if (category) filter.category = category;
  if (weight) filter.weight = weight; // Siklet filtresi
  if (athlete) filter.athlete = new RegExp(athlete, "i");
  if (date) filter.date = date;

  const achievements = await Achievement.find(filter);

  res.status(200).json({
    success: true,
    data: achievements,
  });
});

// UPDATE - ID ile bir başarı güncelle
export const updateAchievement = catchAsync(async (req, res, next) => {
  const { weight } = req.body;

  if (!weight) {
    return next(new ErrorHandler("Siklet alanı gereklidir.", 400));
  }

  let achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    return next(new ErrorHandler("Başarı bulunamadı", 404));
  }

  achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Başarı başarıyla güncellendi",
    data: achievement,
  });
});

// DELETE - ID ile bir başarı sil
export const deleteAchievement = catchAsync(async (req, res, next) => {
  const achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    return next(new ErrorHandler("Başarı bulunamadı", 404));
  }

  await achievement.deleteOne();

  res.status(200).json({
    success: true,
    message: "Başarı başarıyla silindi",
  });
});

// Benzersiz filtreleme değerlerini getir
export const getFilterOptions = catchAsync(async (req, res, next) => {
  const locations = await Achievement.distinct("location"); // Benzersiz yerleri getir

  res.status(200).json({
    success: true,
    data: { locations },
  });
});
