import debounce from 'lodash.debounce';

// Increment video views with debounce to prevent rapid updates
const incrementVideoViews = debounce(async (videoId, accessToken) => {
  try {
    // console.log("trying to increment video views")

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/${videoId}/incrementViews`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to increment views: ", data.message)
    // console.log("Video views incremented")
    return data;

  } catch (error) {
    console.error('Failed to increment views:', error.message);
  }
}, 5000); // Debounce for 5 seconds

const createComment = async (videoId, commentContent, accessToken) => {
  try {
    // console.log("trying to Add Comment")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${videoId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: commentContent })
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to Add Comment: ", data.message)
    // console.log("Comment added to Video")
    return data;

  } catch (error) {
    console.error('Failed to Add Comment:', error.message);
    return;
  }
}

const deleteComment = async (commentId, accessToken) => {
  try {
    console.log("trying to deleteComment")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/c/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to delete Comment: ", data.message)
    console.log("Comment deleted")
    return data;

  } catch (error) {
    console.error('Failed to delete Comment:', error.message);
  }
}

const toggleVideoLike = async (videoId, accessToken) => {
  try {
    // console.log("trying to toggle video like")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/likes/toggle/v/${videoId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to toggle video like: ", data.message)
    // console.log("Video like toggled")
    return data;

  } catch (error) {
    console.error('Failed to toggle video like:', error.message);
  }
}

const toggleSubscription = async (username, accessToken) => {
  try {
    // console.log("trying to toggle subscription")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscriptions/c/${username}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to toggle subscription: ", data.message)
    // console.log("channel subscription toggled")
    return data;

  } catch (error) {
    console.error('Failed to toggle subscription:', error.message);
  }
}

const getSubscriberCount = async (username, accessToken) => {
  try {
    // console.log("trying to getSubscriberCount")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscriptions/c/${username}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to getSubscriberCount: ", data.message)
    // console.log("fetched channel subscriber count")
    return data;

  } catch (error) {
    console.error('Failed to getSubscriberCount:', error.message);
  }
}

const getLikedVideos = async (accessToken) => {
  try {
    // console.log("trying to get liked videos")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/likes/videos`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to liked videos: ", data.message)
    // console.log("fetched liked videos")
    return data;

  } catch (error) {
    console.error('Failed to liked videos:', error.message);
  }
}

const getUserWatchHistory = async (accessToken) => {
  try {
    // console.log("trying to get user Watch History")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    const data = await response.json()
    if (!data.success) return console.log("Failed to get User Watch History: ", data.message)
    // console.log("fetched User Watch History")
    return data;

  } catch (error) {
    console.error('Failed to get User Watch History:', error.message);
  }
}

const publishVideo = async (formData, accessToken) => {
  try {
    console.log("trying to publishVideo")
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/videos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData
    });
    const data = await response.json()
    if (!data.success) {
      console.log("Failed to Add Comment: ", data.message)
      return data
    }
    console.log("Video Published")
    return data;

  } catch (error) {
    console.error('Failed to publishVideo:', error.message);
    return;
  }
}

export {
  incrementVideoViews,
  createComment,
  deleteComment,
  toggleVideoLike,
  toggleSubscription,
  getSubscriberCount,
  getLikedVideos,
  getUserWatchHistory,
  publishVideo
}