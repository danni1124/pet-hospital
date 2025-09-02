import api from './index';
import axios from 'axios';


const BASE_URL = 'http://47.113.205.34:8085';

export const addPost = (data) => api.post('/addPost', data);
export const getPostsByPage = (pageSize, offset) => api.get('/getPostsByPage', { params: { pageSize, offset } });
export const getPostNum = () => api.get('/getPostNum');
export const addComment = (data)=> api.post('/addComment', data);
export function getComments(postId) {
  return api.get('/getComment', {
    params: { postId } 
  });
}
// 更新帖子统计数据（浏览量、点赞数、收藏数）
// 修改后的 updatePostStats 方法
export const updatePostStats = (type, action, postId, userId, newNum) => {
  console.log('帖子请求参数', type, action, postId, userId, newNum)
  const formData = new URLSearchParams()
  formData.append('type', type)
  formData.append('action', action)
  formData.append('postId', postId)
  formData.append('userId', userId)
  formData.append('newNum', newNum)

  return api.post('/updateNumInPost', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(response => {
    console.log('后端返回的数据:', response.data);
    return response;
  }).catch(error => {
    console.error('请求失败:', error);
    throw error;
  });
}


export const updateCommentLikes = (action,commentId, userId, newNum) => {
  console.log('评论点赞请求参数', action, commentId, userId, newNum)
  return api.post(
    `/updateNumInComment?action=${action}&commentId=${commentId}&userId=${userId}&newNum=${newNum}`
  );
};


// 检查帖子点赞/收藏状态
export const checkPostStatus = (type, postId, userId) => {
  const formData = new URLSearchParams();
  formData.append('type', type);
  formData.append('postId', postId);
  formData.append('userId', userId);
  
  return api.post('/checkStatusInPost', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};

// 检查评论点赞状态 
export const checkCommentStatus = (commentId, userId) => {
  const formData = new URLSearchParams();
  formData.append('commentId', commentId);
  formData.append('userId', userId);
  
  return api.post('/checkStatusInComment', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};


// api/post.js
export const deletePost = (postId) => api.get('/deletePost', { params: { postId: postId } });
export const deleteComment = (commentId) => api.get('/deleteComment', { params: {commentId : commentId } });

// api/post.js
export async function uploadImages(files) {
  const urls = [];
  for (const file of files) {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await api.post('/uploadImage', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { isAvatar: false }
      });
      if (data.code === 200 && data.data) {
        urls.push(data.data); // 每张图的路径
      }
    } catch (err) {
      console.error('上传失败：', err);
    }
  }
  return urls; // ["images/img1.png", "images/img2.png", ...]
}




export async function deleteImage(imagePath) {
  try {
    const formData = new FormData();
    formData.append('filePaths', imagePath);

    const response = await api.post('/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.code === 200) {
      console.log('图片删除成功');
      return true;
    } else {
      console.error('图片删除失败:', response.data.msg);
      return false;
    }
  } catch (error) {
    console.error('删除图片时发生错误:', error);
    return false;
  }
}


export function getFullImageUrl(path) {
  if (!path || typeof path !== 'string') return [];
  return path
    .split(',')
    .map(p => (p.startsWith('http') ? p : `${BASE_URL}${p}`));
}


