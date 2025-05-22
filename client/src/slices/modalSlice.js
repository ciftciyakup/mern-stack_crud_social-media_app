import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  modalType: null,
  newsToDelete: null,
  newsToEdit: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showDeleteModal(state, action) {
      state.showModal = true;
      state.modalType = "DELETE";
      state.newsToDelete = action.payload;
    },
    showAddModal(state, action) {
      state.showModal = true;
      state.modalType = "ADD";
    },
    showEditModal(state, action) {
      state.showModal = true;
      state.modalType = "EDIT";
      state.newsToEdit = action.payload;
    },
    closeModal(state) {
      state.showModal = false;
      state.modalType = null;
      state.newsToDelete = null;
      state.newsToEdit = null;
    },
  },
});

export const { showDeleteModal, showAddModal, showEditModal, closeModal } =
  modalSlice.actions;

export default modalSlice.reducer;
