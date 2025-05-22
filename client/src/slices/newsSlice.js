import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// İstek başarılı olduğunda haberleri alma işlemi
export const getNews = createAsyncThunk(
  "news/getNews",
  async ({ fields, currentPage, limit }) => {
    const response = await axios.get("/news", {
      params: {
        fields,
        page: currentPage,
        limit,
      },
    });
    return response.data;
  }
);

// Yeni haber ekleme işlemi
export const addNews = createAsyncThunk(
  "news/addNews",
  async ({ title, image, date, content }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image); // Görüntü dosyasını FormData ile gönderin
    formData.append("date", date);
    formData.append("content", content);
    try {
      const response = await axios.post("/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData için gerekli başlık
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // Sunucudan dönen hataları yakalamak ve handle etmek için rejectWithValue kullanıyoruz
      if (error.response.data.errors)
        return rejectWithValue(
          error.response.data.errors.map((error) => error.msg)
        );
      else return rejectWithValue(error.response.data.message);
    }
  }
);

// url'ye göre bir Haberi getiren işlem
export const getOneNews = createAsyncThunk("news/getOneNews", async (url) => {
  const response = await axios.get(`/news/${url}`);
  return response.data;
});

// Haberi düzenleme işlemi
export const editNews = createAsyncThunk(
  "news/editNews",
  async ({ url, title, image, date, content }, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image); // Görüntü dosyasını FormData ile gönderin
    formData.append("date", date);
    formData.append("content", content);

    try {
      const response = await axios.patch(`/news/${url}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData için gerekli başlık
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      // Sunucudan dönen hataları yakalamak ve handle etmek için rejectWithValue kullanıyoruz
      if (error.response.data.errors)
        return rejectWithValue(
          error.response.data.errors.map((error) => error.msg)
        );
      else return rejectWithValue(error.response.data.message);
    }
  }
);

// Haberi silme işlemi
export const deleteNews = createAsyncThunk("news/deleteNews", async (url) => {
  await axios.delete(`/news/${url}`, {
    withCredentials: true,
  });
  return url;
});

const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: null,
    updateNews: false,
    newsList: [],
    updateNewsList: false,
    currentPage: 1,
    totalPages: 1,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // getNews
      .addCase(getNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.newsList = action.payload.news;
        state.updateNewsList = false;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // addNews
      .addCase(addNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newsList.push(action.payload);
        state.updateNewsList = true;
        toast.success("Haber Ekleme İşlemi Başarılı.");
      })
      .addCase(addNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload
          ? action.payload
          : "Sunucu hatası. Lütfen tekrar deneyin.";
        toast.error(state.error);
      })

      // editNews
      .addCase(editNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(editNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        const editedNewsIndex = state.newsList.findIndex(
          (news) => news._id === action.payload._id
        );
        if (editedNewsIndex !== -1) {
          state.newsList[editedNewsIndex] = action.payload;
        }
        state.news = action.payload;
        state.updateNews = true;
        state.updateNewsList = true;
        toast.success("Güncelleme İşlemi Başarılı.");
      })
      .addCase(editNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error
          ? action.payload
          : "Sunucu hatası. Lütfen tekrar deneyin.";
        toast.error(state.error);
      })

      // getOneNews
      .addCase(getOneNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getOneNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.news = action.payload;
        state.updateNews = false;
      })
      .addCase(getOneNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // deleteNews
      .addCase(deleteNews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.newsList = state.newsList.filter(
          (news) => news._id !== action.payload.id
        );
        state.updateNews = true;
        state.updateNewsList = true;
        toast.success("Haber Silme İşlemi Başarılı.");
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
