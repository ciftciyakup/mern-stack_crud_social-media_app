import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearLikeErrors, resetLikePost } from "../../../slices/likePostSlice";
import {
  clearNewCommentErrors,
  resetNewComment,
} from "../../../slices/newCommentSlice";
import {
  clearSavePostErrors,
  resetSavePost,
} from "../../../slices/savePostSlice";
import {
  clearDeleteErrors,
  resetDeletePost,
} from "../../../slices/deletePostSlice";
import { getUserDetails } from "../../../slices/userDetailsSlice";
import PostItem from "./PostItem";

const PostContainer = ({ posts, id }) => {
  const dispatch = useDispatch();
  const params = useParams();

  const {
    error: likeError,
    message,
    success,
  } = useSelector((state) => state.likePost);
  const {
    error: commentError,
    success: commentSuccess,
    message: commentMessage,
  } = useSelector((state) => state.newComment);
  const {
    error: saveError,
    success: saveSuccess,
    message: saveMessage,
  } = useSelector((state) => state.savePost);
  const { error: deleteError, success: deleteSuccess } = useSelector(
    (state) => state.deletePost
  );

  useEffect(() => {
    dispatch(getUserDetails(params.username));
    if (likeError) {
      toast.error(likeError);
      dispatch(clearLikeErrors());
    }
    if (success) {
      toast.success(message);
      dispatch(resetLikePost());
    }
    if (commentError) {
      toast.error(commentError);
      dispatch(clearNewCommentErrors());
    }
    if (commentSuccess) {
      toast.success(commentMessage);
      dispatch(resetNewComment());
    }
    if (saveError) {
      toast.error(saveError);
      dispatch(clearSavePostErrors());
    }
    if (saveSuccess) {
      toast.success(saveMessage);
      dispatch(resetSavePost());
    }
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearDeleteErrors());
    }
    if (deleteSuccess) {
      toast.success("Gönderi Silindi");
      dispatch(resetDeletePost());
    }
  }, [
    dispatch,
    success,
    likeError,
    message,
    commentError,
    commentSuccess,
    commentMessage,
    saveError,
    saveSuccess,
    saveMessage,
    deleteError,
    deleteSuccess,
  ]);

  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-8 my-1 mb-8" id={id}>
      {posts?.map((post, i) => <PostItem {...post} key={i} />).reverse()}
    </div>
  );
};

export default PostContainer;
