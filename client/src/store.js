import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import forgotPasswordSlice from "./slices/forgotPasswordSlice";
import userDetailsSlice from "./slices/userDetailsSlice";
import allUsersSlice from "./slices/allUsersSlice";
import profileSlice from "./slices/profileSlice";
import newPostSlice from "./slices/newPostSlice";
import postOfFollowingSlice from "./slices/postOfFollowingSlice";
import likePostSlice from "./slices/likePostSlice";
import newCommentSlice from "./slices/newCommentSlice";
import savePostSlice from "./slices/savePostSlice";
import deletePostSlice from "./slices/deletePostSlice";
import postDetailsSlice from "./slices/postDetailsSlice";
import newsSlice from "./slices/newsSlice";
import modalSlice from "./slices/modalSlice";
import allChatsSlice from "./slices/allChatsSlice";
import allMessagesSlice from "./slices/allMessagesSlice";
import newMessageSlice from "./slices/newMessageSlice";
import newChatSlice from "./slices/newChatSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    forgotPassword: forgotPasswordSlice,
    userDetails: userDetailsSlice,
    allUsers: allUsersSlice,
    profile: profileSlice,
    newPost: newPostSlice,
    postOfFollowing: postOfFollowingSlice,
    likePost: likePostSlice,
    newComment: newCommentSlice,
    savePost: savePostSlice,
    deletePost: deletePostSlice,
    postDetails: postDetailsSlice,
    news: newsSlice,
    modal: modalSlice,
    allChats: allChatsSlice,
    allMessages: allMessagesSlice,
    newMessage: newMessageSlice,
    newChat: newChatSlice,
  },
});
