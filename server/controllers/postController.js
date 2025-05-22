import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import ErrorHandler from "../utils/errorHandler.js";
import deleteFile from "../utils/deleteFile.js";

// Create New Post
export const newPost = catchAsync(async (req, res, next) => {
  const postData = {
    caption: req.body.caption,
    image: req.file.filename,
    postedBy: req.user._id,
  };

  const post = await Post.create(postData);

  const user = await User.findById(req.user._id);
  user.posts.push(post._id);
  await user.save();

  res.status(201).json({
    success: true,
    post,
  });
});

// Like or Unlike Post
export const likeUnlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  if (post.likes.includes(req.user._id)) {
    const index = post.likes.indexOf(req.user._id);

    post.likes.splice(index, 1);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Beğeni Kaldırıldı",
    });
  } else {
    post.likes.push(req.user._id);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Gönderi Beğenildi",
    });
  }
});

// Delete Post
export const deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  if (
    post.postedBy.toString() !== req.user._id.toString() &&
    req.user.userType != "admin"
  ) {
    return next(new ErrorHandler("Yetkisiz", 401));
  }

  await deleteFile("posts/", post.image);

  // Gönderiyi kaydeden kullanıcıların saved listesinden çıkar
  const savedByUsers = await User.find({ saved: post._id });
  for (const user of savedByUsers) {
    const index = user.saved.indexOf(post._id);
    if (index > -1) {
      user.saved.splice(index, 1);
      await user.save();
    }
  }

  await post.deleteOne();

  // Kullanıcının post listesinden çıkar
  const user = await User.findById(req.user._id);
  const index = user.posts.indexOf(req.params.id);
  if (index > -1) {
    user.posts.splice(index, 1);
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Gönderi Silindi",
  });
});

// Update Caption
export const updateCaption = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Yetkisiz", 401));
  }

  post.caption = req.body.caption;

  await post.save();

  res.status(200).json({
    success: true,
    message: "Gönderi Güncellendi",
  });
});

// Add Comment
export const newComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  if (post.comments.includes(req.user._id)) {
    return next(new ErrorHandler("Zaten Yorum Yapıldı", 500));
  }

  post.comments.push({
    user: req.user._id,
    comment: req.body.comment,
  });

  await post.save();

  return res.status(200).json({
    success: true,
    message: "Yorum Eklendi",
  });
});

// Delete Comment
export const deleteComment = catchAsync(async (req, res, next) => {
  const postId = await Post.findById(req.params.id);

  if (!postId) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  const commentId = postId.comments.id(req.params.commentId);

  if (!commentId) {
    return next(new ErrorHandler("Yorum Bulunamadı", 404));
  }

  if (!commentId.user.equals(req.user._id) && req.user.userType != "admin") {
    return next(new ErrorHandler("Bu yorumu silme izniniz yok", 403));
  }

  await Post.updateOne(
    { _id: postId },
    { $pull: { comments: { _id: commentId } } }
  );

  return res.status(200).json({
    success: true,
    message: "Yorum Silindi",
  });
});

// Posts of Following
export const getPostsOfFollowing = catchAsync(async (req, res, next) => {
  const currentPage = Number(req.query.page) || 1;
  const skipPosts = 4 * (currentPage - 1);

  const totalPosts = await Post.find().countDocuments();

  const posts = await Post.find()
    .populate("postedBy likes")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .sort({ $natural: -1 })
    .limit(4)
    .skip(skipPosts);

  return res.status(200).json({
    success: true,
    posts: posts,
    totalPosts,
  });
});

// Save or Unsave Post
export const saveUnsavePost = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  if (user.saved.includes(post._id.toString())) {
    user.saved = user.saved.filter((p) => p.toString() !== post._id.toString());
    post.savedBy = post.savedBy.filter(
      (p) => p.toString() !== req.user._id.toString()
    );
    await user.save();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Gönderi Kaydedilenlerden Çıkarıldı",
    });
  } else {
    user.saved.push(post._id);
    post.savedBy.push(req.user._id);

    await user.save();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Gönderi Kaydedildi",
    });
  }
});

// Get Post Details
export const getPostDetails = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("postedBy likes")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  if (!post) {
    return next(new ErrorHandler("Gönderi Bulunamadı", 404));
  }

  res.status(200).json({
    success: true,
    post,
  });
});

// Get All Posts
export const allPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find();

  return res.status(200).json({
    posts,
  });
});
