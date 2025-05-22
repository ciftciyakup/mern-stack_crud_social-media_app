import fs from "fs";
import path from "path";
import Tournament from "../models/tournamentModel.js";
import slugify from "slugify";
import catchAsync from "../middlewares/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";

// Tüm turnuvaları getir
export const getAllTournaments = catchAsync(async (req, res, next) => {
  const tournaments = await Tournament.find();
  res.status(200).json(tournaments);
});

// Belirli bir turnuvayı getir
export const getTournamentByUrl = catchAsync(async (req, res, next) => {
  const tournament = await Tournament.findOne({ url: req.params.url }).populate("athletes");
  if (!tournament) {
    return next(new ErrorHandler("Turnuva bulunamadı.", 404));
  }
  res.status(200).json(tournament);
});

// Yeni bir turnuva oluştur
export const createTournament = catchAsync(async (req, res, next) => {
  const { name, startDate, endDate, isCompleted, video } = req.body;

  // Slug'ı turnuva adına göre oluştur
  const url = slugify(name, { lower: true, strict: true });

  const newTournament = new Tournament({
    name,
    url,
    startDate,
    endDate,
    isCompleted,
    video,
    photo: req.files.photo ? req.files.photo[0].filename : null,
    regulationUrl: req.files.regulation ? req.files.regulation[0].filename : null,
    top7Url: req.files.top7 ? req.files.top7[0].filename : null,
    resultsUrl: req.files.results ? req.files.results[0].filename : null,
  });

  await newTournament.save();
  res.status(201).json(newTournament);
});

// Turnuvayı güncelle
export const updateTournament = catchAsync(async (req, res, next) => {
  const { name, startDate, endDate, isCompleted, video } = req.body;

  const updatedData = {
    name,
    startDate,
    endDate,
    isCompleted,
    video,
  };

  if (name) {
    updatedData.url = slugify(name, { lower: true, strict: true });
  }

  const existingTournament = await Tournament.findById(req.params.id);
  if (!existingTournament) {
    return next(new ErrorHandler("Turnuva bulunamadı.", 404));
  }

  if (req.files.photo) {
    if (existingTournament.photo) {
      const oldPhotoPath = path.join("public/uploads/tournaments", existingTournament.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    updatedData.photo = req.files.photo[0].filename;
  }

  if (req.files.video) {
    if (existingTournament.video) {
      const oldVideoPath = path.join("public/uploads/tournaments", existingTournament.video);
      if (fs.existsSync(oldVideoPath)) {
        fs.unlinkSync(oldVideoPath);
      }
    }
    updatedData.video = req.files.video[0].filename;
  }

  if (req.files.regulation) {
    if (existingTournament.regulationUrl) {
      const oldRegulationPath = path.join(
        "public/uploads/tournaments",
        existingTournament.regulationUrl
      );
      if (fs.existsSync(oldRegulationPath)) {
        fs.unlinkSync(oldRegulationPath);
      }
    }
    updatedData.regulationUrl = req.files.regulation[0].filename;
  }

  if (req.files.top7) {
    if (existingTournament.top7Url) {
      const oldTop7Path = path.join("public/uploads/tournaments", existingTournament.top7Url);
      if (fs.existsSync(oldTop7Path)) {
        fs.unlinkSync(oldTop7Path);
      }
    }
    updatedData.top7Url = req.files.top7[0].filename;
  }

  if (req.files.results) {
    if (existingTournament.resultsUrl) {
      const oldResultsPath = path.join(
        "public/uploads/tournaments",
        existingTournament.resultsUrl
      );
      if (fs.existsSync(oldResultsPath)) {
        fs.unlinkSync(oldResultsPath);
      }
    }
    updatedData.resultsUrl = req.files.results[0].filename;
  }

  const updatedTournament = await Tournament.findByIdAndUpdate(req.params.id, updatedData, {
    new: true,
  });

  if (!updatedTournament) {
    return next(new ErrorHandler("Turnuva bulunamadı.", 404));
  }

  res.status(200).json(updatedTournament);
});

// Turnuvayı sil
export const deleteTournament = catchAsync(async (req, res, next) => {
  const existingTournament = await Tournament.findById(req.params.id);
  if (!existingTournament) {
    return next(new ErrorHandler("Turnuva bulunamadı.", 404));
  }

  if (existingTournament.photo) {
    const photoPath = path.join("public/uploads/tournaments", existingTournament.photo);
    if (fs.existsSync(photoPath)) {
      fs.unlinkSync(photoPath);
    }
  }

  if (existingTournament.regulationUrl) {
    const regulationPath = path.join(
      "public/uploads/tournaments",
      existingTournament.regulationUrl
    );
    if (fs.existsSync(regulationPath)) {
      fs.unlinkSync(regulationPath);
    }
  }

  if (existingTournament.top7Url) {
    const top7Path = path.join("public/uploads/tournaments", existingTournament.top7Url);
    if (fs.existsSync(top7Path)) {
      fs.unlinkSync(top7Path);
    }
  }

  if (existingTournament.resultsUrl) {
    const resultsPath = path.join("public/uploads/tournaments", existingTournament.resultsUrl);
    if (fs.existsSync(resultsPath)) {
      fs.unlinkSync(resultsPath);
    }
  }

  await Tournament.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Turnuva ve ilgili dosyalar silindi." });
});
