const BASE_URL = "http://localhost:3000";

export const getAllPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];   // keeps the UI from crashing
  }
};

export const getPostDetails = async (postId) => {
  try {
    const [postRes, commentsRes] = await Promise.all([
      fetch(`${BASE_URL}/posts/${postId}`),
      fetch(`${BASE_URL}/posts/${postId}/comments`),
    ]);
    if (!postRes.ok) throw new Error(`Failed to fetch post: ${postRes.status}`);
    if (!commentsRes.ok) throw new Error(`Failed to fetch comments: ${commentsRes.status}`);

    const post = await postRes.json();
    const comments = await commentsRes.json();
    return { post, comments };
  } catch (error) {
    console.error(error);
    return { post: null, comments: [] };
  }
};

export const createNewPost = async (newPostData) => {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPostData),
    });
    if (!response.ok) throw new Error(`Failed to create post: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const createNewComment = async (postId, newCommentData) => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCommentData),
    });
    if (!response.ok) throw new Error(`Failed to create comment: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};