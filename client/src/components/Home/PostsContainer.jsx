import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  clearPostOfFollowingErrors,
  getPostsOfFollowing,
  resetPostOfFollowing,
} from "../../slices/postOfFollowingSlice";
import { resetLikePost, clearLikeErrors } from "../../slices/likePostSlice";
import {
  resetNewComment,
  clearNewCommentErrors,
} from "../../slices/newCommentSlice";
import { resetSavePost, clearSavePostErrors } from "../../slices/savePostSlice";
import UsersDialog from "../Layouts/UsersDialog";
import PostItem from "./PostItem";
import InfiniteScroll from "react-infinite-scroll-component";
import SpinLoader from "../Layouts/SpinLoader";
import SkeletonPost from "../Layouts/SkeletonPost";

const PostsContainer = () => {
  const dispatch = useDispatch();

  const [usersList, setUsersList] = useState([]);
  const [usersDialog, setUsersDialog] = useState(false);
  const [page, setPage] = useState(2);

  const { loading, error, posts, totalPosts } = useSelector(
    (state) => state.postOfFollowing
  );
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

  const handleClose = () => setUsersDialog(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPostOfFollowingErrors());
    }
    dispatch(getPostsOfFollowing());
    dispatch(resetPostOfFollowing());
  }, [dispatch, error]);

  useEffect(() => {
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
  ]);

  const fetchMorePosts = () => {
    setPage((prev) => prev + 1);
    dispatch(getPostsOfFollowing(page));
  };

  return (
    <>
      <div className="flex flex-col w-full lg:w-2/3 sm:mt-6 sm:px-8 mb-8">
        {loading &&
          Array(5)
            .fill("")
            .map((el, i) => <SkeletonPost key={i} />)}
        <InfiniteScroll
          dataLength={posts?.length}
          next={fetchMorePosts}
          hasMore={posts?.length !== totalPosts}
          loader={<SpinLoader />}
        >
          <div className="w-full h-full mt-1 sm:mt-6 flex flex-col space-y-4">
            {posts?.map((post) => (
              <PostItem
                key={post._id}
                {...post}
                setUsersDialog={setUsersDialog}
                setUsersList={setUsersList}
              />
            ))}
          </div>
        </InfiniteScroll>

        <UsersDialog
          title="Beğenenler"
          open={usersDialog}
          onClose={handleClose}
          usersList={usersList}
        />
      </div>
    </>
  );
};

export default PostsContainer;
