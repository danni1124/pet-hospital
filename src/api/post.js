import api from './index';
import axios from 'axios';

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
export const updatePostStats = (postId, type, newNum) => {
  return api.get('/updateNum', {
    params: {
      id: postId,
      type: type,
      newNum: newNum
    }
  }).then(response => {
    console.log('后端返回的数据:', response.data);
    return response;
  }).catch(error => {
    console.error('请求失败:', error);
    throw error;
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

// 删除图片
export async function deleteImage(imagePath) {
  try {
    const response = await request({
     url: '/deleteImage',
     method: 'post',
     data: {
       imagePath: imagePath
     }
   });
   if (response.data.code === 200) {
     console.log('图片删除成功');
     return true; // 删除成功返回 true
   } else {
     console.error('图片删除失败:', response.data.msg);
     return false; // 删除失败返回 false
    }
  } catch (error) {
    console.error('删除图片时发生错误:', error);
    return false; // 发生错误返回 false
  }
};

const BASE_URL = 'http://47.113.205.34:8085';

export function getFullImageUrl(path) {
  if (!path || typeof path !== 'string') return [];
  return path
    .split(',')
    .map(p => (p.startsWith('http') ? p : `${BASE_URL}${p}`));
}


export const updateCommentLikes = (commentId, newNum) => {
  console.log("API 请求参数：", { id: commentId, newNum });
  return api.post('/updateNumInComment', {
    id: commentId,
    newNum: newNum
  });
};