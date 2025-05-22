import React from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

const DeleteConfirmation = ({ onConfirm, onCancel, message }) => {
  const { t } = useTranslation();
  const handleConfirm = () => {
    onConfirm(); // Silme işlemini tetikle
    toast.dismiss(); // Toast'u kapat
  };

  const handleCancel = () => {
    onCancel(); // İptal işlemini tetikle
    toast.dismiss(); // Toast'u kapat
  };

  return (
    <div>
      <p>{message || "Bu öğeyi silmek istediğinizden emin misiniz?"}</p>
      <div className="mt-2 flex justify-end space-x-2">
        <button onClick={handleConfirm} className="bg-red-500 text-white px-3 py-1 rounded">
          {t("delete")}
        </button>
        <button onClick={handleCancel} className="bg-gray-300 px-3 py-1 rounded">
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

export const showDeleteConfirmation = ({ onConfirm, message }) => {
  toast((t) => (
    <DeleteConfirmation
      onConfirm={() => {
        onConfirm();
        toast.dismiss(t.id); // Toast'u kapat
      }}
      onCancel={() => toast.dismiss(t.id)} // Toast'u kapat
      message={message}
    />
  ));
};

export default DeleteConfirmation;
