import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../slices/modalSlice";
import { deleteNews, addNews, editNews } from "../../slices/newsSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HaberModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modal = useSelector((state) => state.modal);
  const { showModal, modalType, newsToDelete, newsToEdit } = modal;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setDate("");
    setImage(null);
  };

  const onDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleCloseModal = () => {
    resetForm();
    dispatch(closeModal());
  };

  const handleDeleteConfirmed = () => {
    dispatch(deleteNews(newsToDelete.url));
    navigate("/haberler");
    handleCloseModal();
  };

  const handleAddNews = () => {
    if (!title || !date || !content || !image) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }

    dispatch(addNews({ title, image, date, content }));
    handleCloseModal();
  };

  const handleEditNews = () => {
    if (!title || !date || !content) {
      toast.error("Görüntü hariç tüm alanları doldurmak zorunludur.");
      return;
    }

    dispatch(editNews({ url: newsToEdit.url, title, image, date, content }));
    handleCloseModal();
  };

  useEffect(() => {
    if (modalType === "EDIT") {
      (async () => {
        const { data } = await axios.get(`/news/${newsToEdit.url}`);
        setTitle(data.title);
        setContent(data.content);
        const isoDate = new Date(data.date);
        const formattedDate = isoDate.toISOString().split("T")[0];
        setDate(formattedDate);
      })();
    }
  }, [modalType, newsToEdit?.url]);

  return (
    <>
      {modalType === "DELETE" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={showModal}
          onClose={handleCloseModal}
        >
          <div className="p-4 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-center">
              Haber Silme Onayı
            </h2>
            {newsToDelete && (
              <p className="text-center mt-4">
                "{newsToDelete.title}" başlıklı haber silinecek. Onaylıyor
                musunuz?
              </p>
            )}
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteConfirmed}
              >
                Sil
              </Button>
            </div>
          </div>
        </Dialog>
      )}
      {modalType === "ADD" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={showModal}
          onClose={handleCloseModal}
        >
          <div className="p-4 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-center">
              Yeni Haber Ekle
            </h2>
            <div className="mt-4">
              <TextField
                label="Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </div>
            <div className="mt-4">
              <TextField
                label="Tarih"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="mt-4">
              <label>İçerik</label>
              <ReactQuill value={content} onChange={setContent} />
            </div>
            <div className="mt-4">
              <label>Resim</label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded p-4 cursor-pointer"
              >
                <input {...getInputProps()} />
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Yüklenen Görsel"
                    style={imageStyle}
                  />
                ) : (
                  <p>Resmi buraya sürükleyin ya da tıklayın.</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddNews(title, content, image)}
              >
                Kaydet
              </Button>
            </div>
          </div>
        </Dialog>
      )}
      {modalType === "EDIT" && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={showModal}
          onClose={handleCloseModal}
        >
          <div className="p-4 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-semibold text-center">
              Haberi Düzenle
            </h2>
            <div className="mt-4">
              <TextField
                label="Başlık"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
            </div>
            <div className="mt-4">
              <TextField
                label="Tarih"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
              />
            </div>
            <div className="mt-4">
              <label>İçerik</label>
              <ReactQuill value={content} onChange={setContent} />
            </div>
            <div className="mt-4">
              <label>Resim</label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded p-4 cursor-pointer"
              >
                <input {...getInputProps()} />
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Yüklenen Görsel"
                    style={imageStyle}
                  />
                ) : (
                  <p>Resmi buraya sürükleyin ya da tıklayın.</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditNews(title, image, date, content)}
              >
                Kaydet
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "200px",
  marginTop: "10px",
};

export default HaberModal;
